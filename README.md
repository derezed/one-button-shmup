# One Button Shmup
What happens when you combine a shmup and bullet hell. 
But you have *_no_* control over your movement.


## Game Play

### Player Movement
- The ship automatically starts in the center
- The ship will then move 1 of 2 ways:
- 1) From the `center` to the `right` edge
- 2) From the `center` to the `left` edge
- Once at it's destination edge, the ship will begin moving between each edge of the screen and back again
- The ship continues this path until player death
- 1 The player dies at X amount of damage

### Player Controls
- The ship has 2 interchangeable states:
- - 1) Shooting: The ship shoots it's gun at a fixed interval; and deals damage
- - - - a) Interval is every X seconds
- - 2) Shielded: The ships shields are at max power; the player takes no damage

### Game Loop
- The game plays until the players first death
- The game is endless
- The player strives for the highest `level` possible
- - Each `level` consists of `10 * x` enemies, where `x = {Current Level}`
- - - Example(s):
- - - - Level `1`) 10 enemies
- - - - Level `2`) 20 enemies
- - - - Level `3`) 30 enemies
