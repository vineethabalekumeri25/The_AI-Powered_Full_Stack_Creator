// --- Step 2, Task 2: Creative Exercise (Idol Stats) ---
// We declare variables for the idol's stats from Step 1,
// explicitly assigning a type to each (string, number, boolean).

const idolName: string = "Jennie Kim"
const debutYear: number = 2016
const is_active: boolean = true

console.log("--- Idol Stats (Basic Types) ---")
console.log(`Name: ${idolName}`)
console.log(`Debut Year: ${debutYear}`)
console.log(`Is Active: ${is_active}`)
console.log("\n")

// --- Step 2, Task 3: Creative Exercise (Adapted to Idol Theme) ---
// This is a more direct bridge to building the React component in Step 3.
// It defines the "shape" of an idol object.

interface Idol {
  name: string
  group: string // Equivalent to 'brand'
  debutYear: number
  isActive: boolean
  achievements: string[] // This is an array of strings
}

const jennie: Idol = {
  name: "Jennie Kim",
  group: "BLACKPINK",
  debutYear: 2016,
  isActive: true,
  achievements: [
    "First K-pop female soloist to hit 1B views on YouTube",
    "Chanel global ambassador",
    "Solo debut 'SOLO' was a massive hit",
  ],
}

console.log("--- Idol Object (Complex Types) ---")
console.log(jennie)

export { type Idol, jennie }
