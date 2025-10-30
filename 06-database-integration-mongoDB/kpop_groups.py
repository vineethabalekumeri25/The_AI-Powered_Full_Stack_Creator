# Phase 3, Step 5, Task 1 Exercise:
# Define a list of dictionaries representing K-pop groups.

# Define the list to hold the group data
kpop_groups = [
    {
        "name": "BLACKPINK",
        "members": ["Jennie", "Lisa", "Jisoo", "Rosé"], # Added other known members
        "debut_year": 2016
    },
    # You could add dictionaries for other K-pop groups here
    # For example:
    # {
    #     "name": "BTS",
    #     "members": ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Jungkook"],
    #     "debut_year": 2013
    # },
]

# Print the list to the console when the script is run
print("--- K-Pop Group Data ---")
print(kpop_groups)

# You can also iterate and print formatted data
print("\n--- Formatted Group Info ---")
for group in kpop_groups:
    print(f"Group Name: {group['name']}")
    print(f"Members: {', '.join(group['members'])}")
    print(f"Debut Year: {group['debut_year']}")
    print("-" * 20)
