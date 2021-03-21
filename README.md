# CS 174A Final Project

Creators: Alexandre Walsh (UID: 305-083-852), Bradley Pickard (UID: ), Anna Reed (UID: 705-105-046)

Design and Implementation
    Taking inspiration from Tron and Beat Saber, we created a rhythm-based game that features a player-controlled avatar on tracks, weaving through beat-aligned obstacles. The player uses 3 keys for jump, left, or right, respectively, to aid in navigating through. When the avatar collides with an obstacle, collision detection leads to the score incrementing, with the goal of the game being to get the smallest score by the end of the song.

    The spacing and speed of the obstacles are determined through an array which is encoded to correspond to a certain song. There is an element of the array for each beat in the song which contains either a hurdle object, or a blockade object, and specifies whether to draw the object on the right track, the left track, or both tracks. Each frame, the draw_obstacles function determines which elements of the array to draw and increments the position of each object by a set speed (which is determined by the beats per minute of the song).

    Lighting of the surroundings are also correlated with the beat of the song. Textures in the game were specifically designed by us and lighting and effects were adjusted to create a Tron-like aesthetic to the game.

Advanced Features
Collision detection was implemented using the Axis Aligned Bounding Box technique. At every frame, for each obstacle present on-screen, a bounding box was formed from its center coordinate, width, height, and depth. The same process is performed on the player object, wherever it happens to be in its movement and jump animations. Then, each obstacle bounding box is tested against the player bounding box. In order to prevent multiple collisions on the same obstacle, there is a 3-frame countdown after collision before detection resumes.

References
https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection?fbclid=IwAR1PwtImgN2q1Z56GnnV3mL9GPgbcqtXW2jIdQ0H5yRLx6Gs19AnGk8W3CE
