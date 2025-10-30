# This file is updated with Pydantic models and CRUD endpoints for Step 6.

from fastapi import FastAPI, HTTPException, status, Depends
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId # For validating MongoDB IDs
from pymongo.collection import Collection
from pymongo.results import InsertOneResult, UpdateResult, DeleteResult
import pymongo # For sort order

# Import the database collection from our database.py file
# This assumes database.py is in the same directory
from database import collection as db_collection, entry_helper

# --- Dependency ---
# Create a dependency to ensure database connection is available
async def get_collection() -> Collection:
    """Dependency to provide the MongoDB collection and handle connection errors."""
    if db_collection is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available. Check MONGODB_URI in .env"
        )
    return db_collection

# --- Pydantic Models (Task 2: Data Validation) ---

class JournalEntryBase(BaseModel):
    """Fields common to creating and reading entries."""
    title: str = Field(..., min_length=3, max_length=100, examples=["My Style Ideas"])
    content: str = Field(..., min_length=10, examples=["Today I felt inspired by..."])
    category: Optional[str] = Field("journal", examples=["journal", "fashion", "mood"])

class JournalEntryCreate(JournalEntryBase):
    """Pydantic model for creating a new journal entry."""
    pass # Inherits all fields from base

class JournalEntryUpdate(BaseModel):
    """
    Pydantic model for updating an existing journal entry.
    All fields are optional; only provided fields will be updated.
    """
    title: Optional[str] = Field(None, min_length=3, max_length=100, examples=["Updated Style Ideas"])
    content: Optional[str] = Field(None, min_length=10, examples=["Adding more thoughts..."])
    category: Optional[str] = Field(None, examples=["fashion"])

class JournalEntryResponse(JournalEntryBase):
    """Pydantic model for returning a journal entry (includes ID and timestamp)."""
    id: str = Field(..., examples=["67f1ab123c4d5e6f7a8b9c0d"])
    created_at: str = Field(..., examples=["2025-10-30T11:09:00.123Z"])

# --- FastAPI Application ---

app = FastAPI(
    title="Style Journal API",
    description="API for managing fashion trends and personal journal entries."
)

# --- Existing Endpoints (from Step 5) ---

@app.get("/")
def read_root():
    """
    Root endpoint that returns a simple welcome message.
    """
    return {"message": "Welcome to the Style Journal API!"}

@app.get("/api/trends")
def get_fashion_trends() -> List[dict]:
    """
    Returns a hardcoded list of current fashion trends.
    """
    trends = [
        {"id": "trend-001", "name": "Sustainable Fabrics", "description": "Focus on eco-friendly materials like organic cotton and recycled polyester."},
        {"id": "trend-002", "name": "Bold Colors", "description": "Vibrant hues like emerald green and electric blue are making a statement."},
        {"id": "trend-003", "name": "Retro Revival", "description": "Styles inspired by the 70s and 90s are coming back."},
        {"id": "trend-004", "name": "Comfort Core", "description": "Emphasis on comfortable yet stylish clothing, like elevated loungewear."}
    ]
    return trends


# --- NEW: CRUD API for Journaling (Task 3) ---

@app.post("/api/journal", status_code=status.HTTP_201_CREATED, response_model=JournalEntryResponse)
async def create_journal_entry(
    entry: JournalEntryCreate,
    collection: Collection = Depends(get_collection) # Use dependency injection
):
    """
    Create a new journal entry and save it to MongoDB.
    """
    entry_dict = entry.model_dump()
    entry_dict["created_at"] = datetime.utcnow() # Add timestamp

    try:
        # Pymongo insert_one is synchronous
        new_entry: InsertOneResult = collection.insert_one(entry_dict)
        # Retrieve the newly created entry from the DB to get all fields
        created_entry = collection.find_one({"_id": new_entry.inserted_id})

        if created_entry:
            response = entry_helper(created_entry)
            if response:
                 return response
            else: # Should not happen if find_one succeeds
                 raise HTTPException(status_code=500, detail="Failed to format created entry.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {e}")

    # Fallback if created_entry wasn't found after insert (unlikely)
    raise HTTPException(status_code=500, detail="Failed to create or retrieve entry after insertion")


@app.get("/api/journal", response_model=List[JournalEntryResponse])
async def get_all_journal_entries(collection: Collection = Depends(get_collection)):
    """
    Retrieve all journal entries from the database, newest first.
    """
    entries = []
    try:
        # Pymongo find is synchronous but returns a cursor (iterator)
        for entry in collection.find().sort("created_at", pymongo.DESCENDING): # Sort by newest first
            formatted_entry = entry_helper(entry)
            if formatted_entry:
                entries.append(formatted_entry)
        return entries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving entries: {e}")

@app.get("/api/journal/{id}", response_model=JournalEntryResponse)
async def get_journal_entry(id: str, collection: Collection = Depends(get_collection)):
    """
    Retrieve a single journal entry by its ID.
    """
    try:
        # Validate the ID format before querying
        obj_id = ObjectId(id)
    except Exception: # Catches bson.errors.InvalidId
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid ID format: {id}")

    try:
        entry = collection.find_one({"_id": obj_id})
    except Exception as e:
         raise HTTPException(status_code=status.HTTP_500, detail=f"Database error: {e}")

    if entry:
        response = entry_helper(entry)
        if response:
            return response
        else: # Helper failed
            raise HTTPException(status_code=500, detail="Failed to format entry data.")
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Journal entry with ID {id} not found")


@app.put("/api/journal/{id}", response_model=JournalEntryResponse)
async def update_journal_entry(
    id: str,
    entry_data: JournalEntryUpdate, # <-- This was corrected from JournalUpdate
    collection: Collection = Depends(get_collection)
):
    """
    Update an existing journal entry by its ID.
    Only updates the fields provided in the request body.
    """
    try:
        obj_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid ID format: {id}")

    # Get data to update, excluding any fields that were not set (i.e., are None)
    update_data = entry_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No valid fields provided for update")

    try:
        result: UpdateResult = collection.update_one(
            {"_id": obj_id},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Journal entry with ID {id} not found")
        
        # Retrieve and return the updated document
        updated_entry = collection.find_one({"_id": obj_id})
        if updated_entry:
            response = entry_helper(updated_entry)
            if response:
                return response
            else: # Helper failed
                raise HTTPException(status_code=500, detail="Failed to format updated entry.")
        else: # Should not happen if update succeeded
             raise HTTPException(status_code=500, detail="Failed to retrieve entry after update.")

    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Database update failed: {e}")


@app.delete("/api/journal/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_entry(id: str, collection: Collection = Depends(get_collection)):
    """
    Delete a journal entry by its ID. Returns No Content on success.
    """
    try:
        obj_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid ID format: {id}")
        
    try:
        result: DeleteResult = collection.delete_one({"_id": obj_id})
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Database deletion failed: {e}")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Journal entry with ID {id} not found")
    
    # Return nothing on success, as per HTTP 204
    return

# Optional: Add a simple check to run with uvicorn directly if the script is executed
if __name__ == "__main__":
    import uvicorn
    print("Running FastAPI server...")
    print("Access API docs at http://127.0.0.1:8000/docs")
    print("Access Trends API at http://127.0.0.1:8000/api/trends")
    # Corrected the uvicorn.run string to match the filename "main.py"
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

