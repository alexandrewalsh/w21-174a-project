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
            tron_board: new Material(new Textured_Phong(), {
                texture: new Texture("assets/tron_board.jpg"),
                ambient: .4,
                diffusivity: .6,
                color: hex_color("#000000")}),
            tron_hal: new Material(new Textured_Phong(), {
                texture: new Texture("assets/tron_hal.jpg"),
                ambient: .4,
                diffusivity: .6,
                color: hex_color("#000000")}),
            // ANNA-CREATED MATERIALS //
            red_hurdle: new Material(new Textured_Phong(), {
                texture: new Texture("assets/red_hurdle.png"),
                ambient: .4,
                diffusivity: .6,
                luminosity: 1,
                color: hex_color("#000000")}),
            blue_hurdle: new Material(new Textured_Phong(), {
                texture: new Texture("assets/blue_hurdle.png"),
                ambient: .4,
                diffusivity: .6,
                luminosity: .5,
                color: hex_color("#000000")}),
            red_blockade: new Material(new Textured_Phong(), {
                texture: new Texture("assets/red_blockade.png"),
                ambient: .4,
                diffusivity: .6,
                color: hex_color("#000000")}),
            blue_blockade: new Material(new Textured_Phong(), {
                texture: new Texture("assets/blue_blockade.png"),
                ambient: .4,
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
                ambient: .5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/tron.jpg"),
                min_filter: "LINEAR_MINMAP_FILTERING",
                color: hex_color("#000000")
            }),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

        this.music = new Audio('assets/ForceWait3Sec.mp4');
        //this.music.volume = 1;
        
        this.player = new Player();

        this.status = "waiting";
        this.start_time = 0;

        // for level restart
        this.restart = 0;
    }
  
    // takes array of type of obstacles, draws obstacles
    draw_obstacles(array, obstacle_transform, context, program_state, t) {
        if (this.status == "waiting") {
            return;
        } else if (this.status == "init") {
            this.start_time = t;
            this.status = "playing";
        }
        
        t = t - this.start_time;

        let track_length = 120;
        let spacing = 30;
        let speed = 45;
        //let min_index = Math.floor(t);
        //let max_index = Math.floor((t + track_length)/spacing);

        obstacle_transform = obstacle_transform.times(Mat4.translation(0, 0, speed * t));
        //this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.blue);

        var i = 0;
        for(i; i <= 20; i++) {
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
                     if (t < 5)
                        console.log("Row: " + i + " contains " +  array[i][0] + ", " + array[i][1]);
                     // hurdle accross both tracks
                     this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.red_hurdle);
                     obstacle_transform = obstacle_transform.times(Mat4.translation(2, 0, 0));
                     this.shapes.hurdle.draw(context, program_state, obstacle_transform, this.materials.blue_hurdle);
                     obstacle_transform = obstacle_transform.times(Mat4.translation(-2, 0, 0));
                 }
             }
            if(array[i][0] == "b") {
                if(array[i][1] == "r") {
                    obstacle_transform = obstacle_transform.times(Mat4.translation(2, 0, 0));
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 2, 1));
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, .5, 0));
                    this.shapes.blockade.draw(context, program_state, obstacle_transform, this.materials.red_blockade);
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, -.5, 0));
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 0.5, 1));
                    obstacle_transform = obstacle_transform.times(Mat4.translation(-2, 0, 0));
                }
                if(array[i][1] == "l") {
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 2, 1));
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, .5, 0));
                    this.shapes.blockade.draw(context, program_state, obstacle_transform, this.materials.blue_blockade);
                    obstacle_transform = obstacle_transform.times(Mat4.translation(0, -.5, 0));
                    obstacle_transform = obstacle_transform.times(Mat4.scale(1, 0.5, 1));
                }
            }
            obstacle_transform = obstacle_transform.times(Mat4.translation(0, 0, i * spacing));
        }
    }

    make_background(context, program_state) {
        let bg_transform = Mat4.identity()
                            .times(Mat4.translation(0,0,-20))
                            .times(Mat4.rotation(Math.PI,1,1,0))
                            .times(Mat4.scale(20,20,50));
        this.shapes.bg_cone.draw(context, program_state, bg_transform, this.materials.bg_texture);
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
        this.key_triggered_button("Play/Pause Music", ["m"],
            () => {if (this.music.paused) this.music.play(); else this.music.pause();});
        this.key_triggered_button("Restart Music", ["n"],    
            () => {this.music.load(); this.music.play()});
        this.new_line();
        this.key_triggered_button("Restart Level", ["b"],
            () => {this.restart = 1; this.music.pause()});
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

        const light_position = vec4(0, 11, 20, 1);
        const og_light = new Light(light_position, color(1, 1, 1, 1), 1000);
        const light_position2 = vec4(0, 0, 0, 1);
        const og2_light = new Light(light_position2, color(1, 1, 1, 1), 1000);
        program_state.lights = [og_light];

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const blue = hex_color("#0000ff");
        const red = hex_color("#ff0000");
        let model_transform = Mat4.identity();
      
        let player_transform = this.player.getPosition(t);

        this.shapes.player.draw(context, program_state, player_transform, this.materials.tron_hal);

        // background
        this.make_background(context, program_state);

        // draw left track
        let track_one_transform = Mat4.identity()
                                    .times(Mat4.translation(-1.5, 0, 0))
                                    .times(Mat4.translation(0, 0, -10))
                                    .times(Mat4.scale(1.5, 0.5, 30));
        
        this.shapes.track.draw(context, program_state, track_one_transform, this.materials.blue_light_scroll);

        // draw right track
        let track_two_transform = track_one_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.track.draw(context, program_state, track_two_transform, this.materials.red_light_scroll);

        if (this.restart) {
            this.restart = 0;
            this.status = "waiting";
        }

        let obstacle_array = [  ["-", "-"], ["-", "-"], ["b", "r"], 
                                ["-", "-"], ["-", "-"], ["b", "l"], 
                                ["-", "-"], ["-", "-"], ["h", "b"], 
                                ["-", "-"], ["-", "-"], ["h", "b"], 
                                ["-", "-"], ["-", "-"], ["b", "r"], 
                                ["-", "-"], ["-", "-"], ["b", "l"],
                                ["-", "-"], ["-", "-"], ["h", "b"], 
                                ["-", "-"], ["-", "-"], ["h", "b"],
                                ["-", "-"], ["-", "-"], ["h", "r"], 
                                ["h", "r"], ["b", "r"], ["h", "r"], 
                                ["b", "r"], ["h", "r"], ["h", "r"], 
                                ["h", "r"], ["h", "r"], ["h", "r"], 
                                ["h", "r"], ["h", "r"], ["h", "r"], 
                                ["h", "r"]
                             ];

        let obstacle_transform = Mat4.identity();
        obstacle_transform = obstacle_transform.times(Mat4.translation(-1.5, 1.5, -40));
        obstacle_transform = obstacle_transform.times(Mat4.scale(1.5, 1, 0.5));
        this.draw_obstacles(obstacle_array, obstacle_transform, context, program_state, t);
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

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                // Compute an initial (ambient) color:
                gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
          
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
          
        }`;
    }
}
