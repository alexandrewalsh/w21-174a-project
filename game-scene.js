import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Capped_Cylinder, Cube, Axis_Arrows, Textured_Phong} = defs 
import { Player } from './player.js';

export class GameScene extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            track: new defs.Cube(),
            hurdle: new defs.Cube(),
            blockade: new defs.Cube(),
            cylinder: new defs.Capped_Cylinder(20,20),
            bg_cone: new defs.Closed_Cone(50,50),
            player: new defs.Cube(),
            box: new Cube(),
            text: new defs.Square()
        };

        this.shapes.track.arrays.texture_coord = [
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //bottom
            new Vector([0,0]), new Vector([1,0]), new Vector([0,30]), new Vector([1,30]), //top
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //left
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //right
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //front
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //back
        ];

        this.shapes.blockade.arrays.texture_coord = [
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //bottom
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //top
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //left
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //right
            new Vector([0,0]), new Vector([1,0]), new Vector([0,2]), new Vector([1,2]), //front
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //back
        ];

        this.shapes.hurdle.arrays.texture_coord = [
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //bottom
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //top
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //left
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //right
            new Vector([0,0]), new Vector([1,0]), new Vector([0,1]), new Vector([1,1]), //front
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //back
        ];

        this.shapes.player.arrays.texture_coord = [
            new Vector([0,0]), new Vector([1,0]), new Vector([0,1]), new Vector([1,1]), //bottom
            new Vector([0,0]), new Vector([1,0]), new Vector([0,1]), new Vector([1,1]), //top
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //left
            new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), new Vector([0,0]), //right
            new Vector([0,0]), new Vector([1,0]), new Vector([0,1]), new Vector([1,1]), //front
            new Vector([0,0]), new Vector([1,0]), new Vector([0,1]), new Vector([1,1]), //back
        ];

        // *** Materials
        this.materials = {
            // TEST MATERIALS //
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffff00")}),
            red: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ff0000")}),
            blue: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#0000ff")}),
            // ONLINE TRON MATERIALS //
            tron_hal: new Material(new Textured_Phong(), {
                texture: new Texture("assets/tron_hal.jpg"),
                ambient: 0.4,
                diffusivity: .6,
                color: hex_color("#000000")}),
            // TEXT MATERIALS //
            start_text: new Material(new Textured_Phong, {
                texture: new Texture("assets/PressYtoDance.png"),
                color: hex_color("#9400d3")}),
            // ANNA-CREATED MATERIALS //
            red_hurdle: new Material(new Textured_Phong(), {
                texture: new Texture("assets/red_hurdle.png"),
                ambient: 1,
                diffusivity: .6,
                luminosity: 1,
                color: hex_color("#000000")}),
            blue_hurdle: new Material(new Textured_Phong(), {
                texture: new Texture("assets/blue_hurdle.png"),
                ambient: 1,
                diffusivity: .6,
                luminosity: .5,
                color: hex_color("#000000")}),
            red_blockade: new Material(new Textured_Phong(), {
                texture: new Texture("assets/red_noblur.png"),
                ambient: 1.0,
                diffusivity: .6,
                color: hex_color("#000000")}),
            blue_blockade: new Material(new Textured_Phong(), {
                texture: new Texture("assets/blue_noblur.png"),
                ambient: 1.0,
                diffusivity: .6,
                color: hex_color("#000000")}),
            blue_light_scroll: new Material(new Texture_Scroll_Y(), {
                texture: new Texture("assets/blue_nobg.png"),
                specularity: 1,
                ambient: 1,
                diffusivity: 1,
                color: hex_color("#000000")}),
            red_light_scroll: new Material(new Texture_Scroll_Y(), {
                texture: new Texture("assets/red_nobg.png"),
                specularity: 1,
                ambient: 1,
                diffusivity: 1,
                color: hex_color("#000000")}),
            bg_texture: new Material(new Texture_Scroll_Y(), {
                ambient: 1.0, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/tron.jpg"),
                min_filter: "LINEAR_MINMAP_FILTERING",
                color: hex_color("#000000")
            }),
            // BRADDLESNAKE MATS
            brick: new Material( new defs.Phong_Shader(), { 
                color: color( 1,1,1,1 ),
                ambient: .05, diffusivity: .5, specularity: .5, smoothness: 10
            }),
            player_circle: new Material(new Textured_Phong(), {
                texture: new Texture("assets/player_circle.PNG"),
                ambient: 1,
                diffusivity: 0,
                color: hex_color("#000000")
            }),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

        this.music = new Audio('assets/ForceWait3Sec.mp4');
        //this.music.volume = 1;
        
        this.player = new Player();

        this.status = "waiting";
        this.start_time = 0;

        this.bpm = 105;
        let opb = 2;   // Obstacles per beat, if 2 we are using 8th notes
      
        this.track_length = 120;
        this.speed = 45;
        this.spacing = (60 * this.speed) / (this.bpm * opb);
        this.text_transform = Mat4.identity()
                                .times(Mat4.translation(0,3,5))
                                .times(Mat4.scale(9,9,9));
        
      
        // for level restart
        this.restart = 0;
      
        // score
        this.score = 0;
        this.timer = 0;

        // Create arrays for background boxes
        this.bg_r_boxes = [];
        this.bg_l_boxes = [];
        this.bg_b_boxes = [];
        this.bg_wrap = 0;

        // Do left and right background boxes
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.track_length / 4; j++) {
                const box1_height = 1.0 + 3.0 * Math.random();
                const box2_height = 1.0 + 3.0 * Math.random();

                const box1_x_offset = (-1.0)**(i) * (7.0 + 5.0 * Math.random());
                const box2_x_offset = (-1.0)**(i) * (10.0 + 5.0 * Math.random());

                const box1_y_offset = 10.0 * (Math.random() - 0.5) - 1.0;
                const box2_y_offset = 10.0 * (Math.random() - 0.5) - 1.0;

                const row = {'box1': {'height': box1_height, 'x_offset': box1_x_offset, 'y_offset': box1_y_offset},
                             'box2': {'height': box2_height, 'x_offset': box2_x_offset, 'y_offset': box2_y_offset} };

                if (i == 0) {
                    this.bg_r_boxes.push(row);
                } else {
                    this.bg_l_boxes.push(row);   
                }
            } 
        }
        // Do bottom background boxes
        for (let j = 0; j < this.track_length / 4; j++) {
            const box1_height = 1.0 + 3.0 * Math.random();
            const box2_height = 1.0 + 3.0 * Math.random();

            const box1_x_offset = -3.0 + 4.0 * (Math.random() - 0.5);
            const box2_x_offset = 3.0 + 4.0 * (Math.random() - 0.5);

            const box1_y_offset = 5.0 * (Math.random() - 0.5) - 8.0;
            const box2_y_offset = 5.0 * (Math.random() - 0.5) - 8.0;

            const row = {'box1': {'height': box1_height, 'x_offset': box1_x_offset, 'y_offset': box1_y_offset},
                         'box2': {'height': box2_height, 'x_offset': box2_x_offset, 'y_offset': box2_y_offset} };

            this.bg_b_boxes.push(row);
        } 
        console.log("r len: " + this.bg_r_boxes.length);
        console.log("b len: " + this.bg_b_boxes.length);
    }

    // Min index is the earliest obstacle still in front of the camera
        //  Objects begin at: track_length + ~30 + spacing * index in front of camera, thus it
        //  takes (track_length + 10 + spacing*index) / speed seconds to pass camera. If t > this value, don't draw
    getMinIndex(t) {
        return Math.max(0,  Math.round((t*this.speed - this.track_length - 30)/this.spacing)  );
    }

    // Max index is the latest obstacle within a reasonable distance to the camera
        // Objects shouldn't be drawn until they are at position track_length
        // Objects start at position track_length + spacing * index, and need to reach position track_length
        // This traversal takes time t = spacing * index / speed. If t < this value, don't draw this object
    getMaxIndex(t, array) {
        return Math.min(array.length - 1, Math.ceil(t * this.speed / this.spacing));
    }
  
    // takes array of type of obstacles, draws obstacles
    draw_obstacles(array, obstacle_transform, context, program_state, t, light_array) {
        if (this.status == "waiting") {
             this.shapes.text.draw(context, program_state, this.text_transform, this.materials.start_text);
             return;
        } else if (this.status == "init") {
            this.start_time = t;
            this.status = "playing";
        }
        
        t = t - this.start_time;

        let spacing = this.spacing;
        let speed = this.speed;
        
        let min_index = this.getMinIndex(t);
        let max_index = this.getMaxIndex(t, array);

        this.shapes.text.draw(context, program_state, this.text_transform.times(Mat4.translation(0,0,(speed/20) * t)), this.materials.start_text);
        obstacle_transform = obstacle_transform.times(Mat4.translation(0, 0, speed * t));
        //this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.blue);

        var i = min_index;
        for(i; i <= max_index; i++) {
             obstacle_transform = obstacle_transform.times(Mat4.translation(0, 0, -i * spacing));
             if(array[i][0] == "h") {
                 if (array[i][1] == "r") {
                     // right hurdle
                     obstacle_transform = obstacle_transform.times(Mat4.translation(2, 0, 0));
                     this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.red_hurdle);
                     obstacle_transform = obstacle_transform.times(Mat4.translation(-2, 0, 0));
                 }
                 else if (array[i][1] == "l") {
                     // left hurdle
                     this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.blue_hurdle);
                 } else{
                     // hurdle accross both tracks
                     this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.blue_hurdle);
                     obstacle_transform = obstacle_transform.times(Mat4.translation(2, 0, 0));
                     this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.red_hurdle);
                     obstacle_transform = obstacle_transform.times(Mat4.translation(-2, 0, 0));
                 }
             }
            if(array[i][0] == "b") {
                if(array[i][1] == "r") {
                    obstacle_transform = obstacle_transform.times(Mat4.translation(2, 0, 0));
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 4, 1));
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, .5, 0));
                    this.shapes.blockade.draw(context, program_state, obstacle_transform, this.materials.red_blockade);
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, -.5, 0));
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 0.25, 1));
                    obstacle_transform = obstacle_transform.times(Mat4.translation(-2, 0, 0));
                }
                if(array[i][1] == "l") {
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 4, 1));
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, .5, 0));
                    this.shapes.blockade.draw(context, program_state, obstacle_transform, this.materials.blue_blockade);
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, -.5, 0));
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 0.25, 1));
                }
            }
            obstacle_transform = obstacle_transform.times(Mat4.translation(0, 0, i * spacing));
        }

        if (min_index >= array.length) {
            this.status = "waiting"
        }
    }

    draw_box_row(context, program_state, t, i, transform, z, side) {
        let row = this.bg_r_boxes[i];
        if (side == "l") {
            row = this.bg_l_boxes[i];
        } else if (side == "b") {
            row = this.bg_b_boxes[i];
        }

        // Compute box transforms
        let box1_transform = transform.times(Mat4.translation(row.box1.x_offset, row.box1.y_offset, z)).times(Mat4.scale(1, row.box1.height, 1));
        let box2_transform = transform.times(Mat4.translation(row.box2.x_offset, row.box2.y_offset, z)).times(Mat4.scale(1, row.box2.height, 1));
        
        // Set lighting for row
        let light_pos = box1_transform.times(vec4(0, 0, 0, 1)).plus(vec4(0, 5, 3, 0));
        let light_color = color(1, 0.1, 0, 1);
        if (side == "l") {
            light_color = color(0, 0.3, 1, 1);
        } else if (side == "b") {
            light_color = color(0.7, 0.1, 0.7, 1);
        }
        
        let pulse_time = 1 / 60 / (1 / this.bpm);
        program_state.lights = [ new Light( light_pos, light_color, 30 * Math.sin(Math.PI*pulse_time*(t - this.start_time)) + 32 ) ]; 

        let lit_range = 2 * this.bg_r_boxes.length / 3;
        let curr_lit = [    Math.floor(Math.random() * lit_range),
                            /*Math.floor(lit_range - (11 * t) % lit_range)*/  ];
        
        if (curr_lit.includes(i)) {
            program_state.lights.push( new Light( light_pos, color(1, 0.2, 1, 1), 10 ) );
        }

        // Draw
        this.shapes.box.draw(context, program_state, box1_transform, this.materials.brick);
        this.shapes.box.draw(context, program_state, box2_transform, this.materials.brick);

        program_state.lights = [];
    }

    make_background(context, program_state, t) {
        let bg_transform = Mat4.identity()
                            .times(Mat4.translation(0,0,-20))
                            .times(Mat4.rotation(Math.PI,1,1,0))
                            .times(Mat4.scale(20, 20, this.track_length));
        //this.shapes.bg_cone.draw(context, program_state, bg_transform, this.materials.bg_texture);

        // As background boxes move, we wrap them from front to back of array
        let t_since_wrap = t - this.bg_wrap;
        if (t_since_wrap > 6 / (this.speed / 2)) {
            this.bg_r_boxes.push(this.bg_r_boxes.shift());
            this.bg_l_boxes.push(this.bg_l_boxes.shift());
            this.bg_b_boxes.push(this.bg_b_boxes.shift());
            this.bg_wrap = t;
            t_since_wrap = 0;
        }

        // Draw all the boxes
        let bg_box_transform = Mat4.identity().times(Mat4.translation(0, 1.5, 30));
        for (let i = 0; i < this.bg_r_boxes.length; i++) {
            this.draw_box_row(context, program_state, t, i, bg_box_transform, t_since_wrap * this.speed / 2, "r");
            this.draw_box_row(context, program_state, t, i, bg_box_transform, t_since_wrap * this.speed / 2, "l");
            this.draw_box_row(context, program_state, t, i, bg_box_transform, t_since_wrap * this.speed / 2, "b");

            bg_box_transform = bg_box_transform.times(Mat4.translation(0, 0, -6));
        }
    }

    detect_collision(t, array, player_transform) {
        if (this.status == "waiting" || this.status == "init") {
            return false;
        }

        t = t - this.start_time;

        let start = this.getMinIndex(t);
        let end = this.getMaxIndex(t, array);

        let i = start;
        for (i; i <= end; i++) {
            // Get the lane and type of the current obstacle
            let lane = array[i][1];
            let type = array[i][0];
            
            // Get the height, width, depth, and position of the obstacle
            let height, width, depth = 1;
            let obstacle_transform = Mat4.identity()
                                         .times(Mat4.translation(0, 1.5, -this.track_length + this.speed * t - i * this.spacing));

            if (lane == "l") {
                obstacle_transform = obstacle_transform.times(Mat4.translation(-1.5, 0, 0));
                width = 3;
            } else if (lane == "r") {
                obstacle_transform = obstacle_transform.times(Mat4.translation(1.5, 0, 0));
                width = 3;
            } else { // Obstacle is a cross-lane hurdle
                width = 6;
            }

            if (type == "h") {
                height = 2;
            } else if (type == "b") {
                height = 8;
                obstacle_transform = obstacle_transform.times(Mat4.translation(0, 0.5, 0));
            } else { // Dummy obstacle
                continue;
            }
            
            let obstacle_center = obstacle_transform.times(vec4(0, 0, 0, 1)).to3();
            let player_center = player_transform.times(vec4(0, 0, 0, 1)).to3();

            // Get obstacle and player bounding dimensions
            let o_max_x = obstacle_center[0] + width/2;
            let o_max_y = obstacle_center[1] + height/2;
            let o_max_z = obstacle_center[2] + depth/2;

            let o_min_x = obstacle_center[0] - width/2;
            let o_min_y = obstacle_center[1] - height/2;
            let o_min_z = obstacle_center[2] + depth/2;

            // Player
            let p_max_x = player_center[0] + 1;
            let p_max_y = player_center[1] + 1;
            let p_max_z = player_center[2] + 1;

            let p_min_x = player_center[0] - 1;
            let p_min_y = player_center[1] - 1;
            let p_min_z = player_center[2] - 1;

            let collide =   (o_min_x <= p_max_x && o_max_x >= p_min_x) &&
                            (o_min_y <= p_max_y && o_max_y >= p_min_y) &&
                            (o_min_z <= p_max_z && o_max_z >= p_min_z);
            /*
            if (draw) {
                console.log("Obstacle[" + i + "] has the following ranges:");
                console.log("\tX: " + o_min_x + " to " + o_max_x);
                console.log("\tY: " + o_min_y + " to " + o_max_y);
                console.log("\tZ: " + o_min_z + " to " + o_max_z + "\n");
            }

            if (draw && i == end) {
                console.log("Player has the following ranges:");
                console.log("\tX: " + p_min_x + " to " + p_max_x);
                console.log("\tY: " + p_min_y + " to " + p_max_y);
                console.log("\tZ: " + p_min_z + " to " + p_max_z + "\n");
            }*/

            if (collide) {
                console.log("Collided!");
                return true;
            }
        }

        return false;
    } 

    make_control_panel() {
        // Draw the game's buttons
        this.key_triggered_button("Move Left", ["g"], function () {
            this.player.tryMove("left");
        });
        this.key_triggered_button("Move Right", ["j"], function () {
            this.player.tryMove("right");
        });
        this.new_line();
        this.key_triggered_button("Jump", ["y"], function () {
            if (this.status == "waiting") {
                this.status = "init";
                this.music.load();
                this.music.play();
            }
            this.player.jump();
        });
        this.new_line();
        this.new_line();
        this.key_triggered_button("Play/Pause Music", ["m"],
            () => {if (this.music.paused) this.music.play(); else this.music.pause();});
        this.key_triggered_button("Restart Music", ["n"],    
            () => {this.music.load(); this.music.play()});
        this.new_line();
        this.key_triggered_button("Restart Level", ["b"],
            () => {this.restart = 1; this.music.pause()});
        this.new_line();
        this.live_string(box => box.textContent = "- Score: " + this.score);
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const light_position = vec4(0, 2, 50, 1);
        const og_light = new Light(light_position, color(1, 1, 1, 1), 5000);
        const light_position2 = vec4(0, 20, -20, 1);
        const og2_light = new Light(light_position2, color(1, 1, 1, 1), 1000);

        const player_light_position = vec4(1.7, 1.5, 20, 1);
        const player_light = new Light(player_light_position, color(0.5, 0.5, 1, 1), 1);

        program_state.lights = [player_light];

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const blue = hex_color("#0000ff");
        const red = hex_color("#ff0000");
        let model_transform = Mat4.identity();
      
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Draw Player
        let player_transform = this.player.getPosition(t);
        let player_inner_transform = player_transform.times(Mat4.scale(0.99, 0.99, 0.99));
        this.shapes.player.draw(context, program_state, player_inner_transform, this.materials.brick);
        let lane = this.player.getLane();

        let pulse_time = 1 / 60 / (1 / this.bpm);
        let pulse_color = 0.3 * Math.sin(Math.PI*pulse_time*(t - this.start_time)) + 0.7;

        if (lane == "r") {
            this.shapes.player.draw(context, program_state, player_transform, this.materials.player_circle.override({color: color(pulse_color, 0.1, 0.1, 1)}));
        } else {
            this.shapes.player.draw(context, program_state, player_transform, this.materials.player_circle.override({color: color(0.1, 0.1, pulse_color, 1)}));
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // background
        this.make_background(context, program_state, t);

        // draw left track
        let track_one_transform = Mat4.identity()
                                    .times(Mat4.translation(-1.5, 0, 0))
                                    .times(Mat4.translation(0, 0, -10))
                                    .times(Mat4.scale(1.5, 0.5, this.track_length));
        
        this.shapes.track.draw(context, program_state, track_one_transform, this.materials.blue_light_scroll);

        // draw right track
        let track_two_transform = track_one_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.track.draw(context, program_state, track_two_transform, this.materials.red_light_scroll);

        if (this.restart) {
            this.restart = 0;
            this.status = "waiting";
            this.score = 0;
        }

        /* Obstacle Types:
         * hurdle:
         * ["h", "b"],  // double hurdle (must jump to dodge)
         * ["h", "l"],  // left hurdle (jump or be in right lane to dodge)
         * ["h", "r"],  // right hurdle (jump or be in left lane to dodge)
         * blockade:
         * ["b", "b"],  // don't do this one you heathen
         * ["b", "l"],  // left blockade (must be in right lane to dodge)
         * ["b", "r"],  // right blockade (must be in left lane to dodge)
         * neither:
         * ["-", "-"],
         */


        let obstacle_array = [  // start (no note buffer)   
                                ["-", "-"], ["-", "-"], /* 0 */

                                ["b", "r"], ["-", "-"], /* 1 */     ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],
                                ["b", "l"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],
                                ["h", "r"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],
                                ["h", "l"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["b", "r"], ["-", "-"], /* 5 */     ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],
                                ["b", "l"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],
                                ["b", "r"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],
                                ["b", "l"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 9 */     ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 13 */    ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],

                                ["-", "-"], ["-", "-"], /* 17 */    ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],

                                ["b", "r"], ["b", "l"], /* 21 */    ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 25 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 29 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 33 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 37 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["b", "r"], ["b", "l"], /* 41 */    ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],

                                ["b", "r"], ["b", "l"], /* 45 */    ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["-", "-"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 49 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 53 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 57 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 61 */    ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 65 */    ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["h", "b"], ["-", "-"],

                                ["-", "-"], ["-", "-"], /* 69 */    ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["h", "b"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],

                                ["b", "r"], ["b", "l"], /* 73 */    ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],             ["b", "r"], ["b", "l"],
                                ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 77 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 81 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 85 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],

                                ["h", "b"], ["-", "-"], /* 89 */    ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["h", "b"], ["-", "-"],             ["b", "r"], ["-", "-"],             ["h", "b"], ["-", "-"],             ["b", "l"], ["-", "-"],
                                ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],             ["-", "-"], ["-", "-"],

                                ["-", "-"], ["h", "r"], /* 93 */    ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],
                                ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],
                                ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],
                                ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],

                                ["-", "-"], ["h", "r"], /* 97 */    ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "r"],
                                ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "r"],
                                ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "r"],
                                ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "l"],             ["-", "-"], ["h", "r"],             ["-", "-"], ["h", "r"],

                             ];

        let obstacle_transform = Mat4.identity();
        obstacle_transform = obstacle_transform.times(Mat4.translation(-1.5, 1.5, -this.track_length));
        obstacle_transform = obstacle_transform.times(Mat4.scale(1.5, 1, 1));
        this.draw_obstacles(obstacle_array, obstacle_transform, context, program_state, t);

        if (this.detect_collision(t, obstacle_array, player_transform)) {
            this.timer = 3;
        }
        if(this.timer > 0){
            this.timer = this.timer - 1;
        }
        if(this.timer == 1){
            this.score = this.score + 1;
            this.timer = 0;
        }
    }
}

class Texture_Scroll_Y extends Textured_Phong {
    constructor(speed = 3) {
        super();
        this.speed = speed;
    }

    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                const int SPEED = ` + this.speed + `;
                float speed = mod (animation_time * float(SPEED), 128.0);    //SPEED * t % 128

                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, vec2(f_tex_coord.x, f_tex_coord.y - speed));
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}
