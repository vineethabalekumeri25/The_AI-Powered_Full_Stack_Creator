import os
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Get the MongoDB connection string from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")

client: MongoClient | None = None
db: Database | None = None
collection: Collection | None = None

if not MONGODB_URI or "<" in MONGODB_URI:
    print("*"*80)
    print("ERROR: MONGODB_URI not found or is still a placeholder in .env file.")
    print("Please create a .env file and add your MongoDB Atlas connection string.")
    print("Example: MONGODB_URI=\"mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority\"")
    print("*"*80)
    # In a real app, you might raise an exception or handle this more gracefully
else:
    # Create a MongoDB client
    # We set appName to 'styleJournal' for better monitoring in MongoDB Atlas
    try:
        client = MongoClient(MONGODB_URI, appName="styleJournal")
        # Ping the server to confirm connection
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        
        # Access the 'style_journal' database
        # If it doesn't exist, MongoDB will create it on first write
        db = client.style_journal

        # Access the 'journal_entries' collection
        # If it doesn't exist, MongoDB will create it on first write
        collection = db.journal_entries

    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        # Handle this more gracefully in a production app
        client = None
        db = None
        collection = None


# --- Helper Function ---
# MongoDB uses _id as an ObjectId, which isn't directly JSON serializable.
# This helper converts the document to a Python dict and _id to a string.
def entry_helper(entry) -> dict | None:
    """Converts a MongoDB document (BSON) to a JSON-friendly dict."""
    if entry:
        return {
            "id": str(entry["_id"]),
            "title": entry["title"],
            "content": entry["content"],
            "category": entry.get("category"), # Use .get() for safety if field might be missing
            # Assuming you add timestamps later
            "created_at": str(entry.get("created_at", "")) 
        }
    return None

