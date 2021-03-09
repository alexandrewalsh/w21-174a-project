
import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const DEF_X = 2;
const DEF_Y = 1.5;

export class Player {
    constructor() {
        this.player_transform = Mat4.identity().times(Mat4.translation(DEF_X, DEF_Y, 0));
        this.player_moving = false;
        this.player_jumping = false;

        this.started_move = 0;
        this.started_jump = 0;

        this.player_lane = "r";
    }

    isMoving() {
        return this.player_moving;
    }

    isJumping() {
        return this.player_jumping;
    }

    getLane() {
        return this.player_lane;
    }

    tryMove(dir) {
        if (dir == "left" && this.player_lane == "r") {
            this.player_moving = true;
        }
        else if (dir == "right" && this.player_lane == "l") {
            this.player_moving = true;
        }
    }

    jump() {
        this.player_jumping = true;
    }

    // Gets an input 'time' and calculates the location of the player through the movement animation
    // If the animation has completed then return player_moving and started_move to the default state
    getX(time) {
        let dir = -1;

        if (this.player_lane == "l") {
            dir = 1;
        }
        if (time < 0.25) {
            // Player moves sideways with linear speed
            let x_pos = dir * (16*time - 2);
            return Mat4.identity().times(Mat4.translation(x_pos, 0, 0));
        }
        else {
            if (this.player_lane == "l") {
                this.player_lane = "r";
            } else {
                this.player_lane = "l";
            }
            this.player_moving = false;
            this.started_move = 0;
            return Mat4.identity().times(Mat4.translation(DEF_X*dir, 0, 0));
        }
    }

    // Gets an input 'time' and calculates the location of the player through the jump animation
    // If the animation has completed then return player_jumping and started_jump to the default state
    getY(time) {
        if (time < 0.5) {
            // Player jumps in parabolic motion
            let y_pos = -Math.pow(8*time - 2, 2) + 4;
            return Mat4.identity().times(Mat4.translation(0, DEF_Y + y_pos, 0));
        }
        else {
            this.player_jumping = false;
            this.started_jump = 0;
            return Mat4.identity().times(Mat4.translation(0, DEF_Y, 0));
        }
    }

    // Called once per 'display' - modifies this.player_transform based on where player is 
    // in the movement and jump animations
    getPosition(t) {
        // Determine default x_transform based on current lane position
        let x_transform = Mat4.identity().times(Mat4.translation(DEF_X, 0, 0));
        if (this.player_lane == "l") {
            x_transform = Mat4.identity().times(Mat4.translation(-DEF_X, 0, 0));
        }

        // Default y_transform
        let y_transform = Mat4.identity().times(Mat4.translation(0, DEF_Y, 0));

        // Modify x_transform if player in movement animation
        if (this.player_moving) {
            if (this.started_move == 0) {
                this.started_move = t;
            }
            x_transform = this.getX(t - this.started_move);
        }

        // Modify y_transform if player in jump animation
        if (this.player_jumping) {
            if (this.started_jump == 0) {
                this.started_jump = t;
            }
            y_transform = this.getY(t - this.started_jump);
        }

        this.player_transform = x_transform.times(y_transform);
        return this.player_transform;
    }
}