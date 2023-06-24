<script>
    // Svelte imports
    import { onMount, tick } from 'svelte';

    // Drawings imports
    import {
        circle,
        cubeFlip,
        cubeVortex,
        dualRainbow, flame,
        floweryCircle,
        guyWaving,
        loadBar, nathanGandalf,
        spikyBall,
        spiral,
        squareRays
    } from "./drawings";

    // Array containing arrays of paths for each drawing
    let drawingArray = [
        [$guyWaving, $circle, $cubeVortex],
        [$cubeFlip],
        [$cubeVortex],
        [$dualRainbow],
        [$flame],
        [$floweryCircle],
        [$guyWaving],
        [$loadBar],
        [$spikyBall],
        [$spiral],
        [$squareRays],
        [$nathanGandalf]
    ];

    // Variables for storing the current drawing, their paths, and path lengths
    let selectedDrawing = [];
    let lines = [];
    let totalLengths = [];

    // Drawing and rewinding parameters
    let maxDrawRate = 100; // max speed of drawing
    let rewindRate = 350; // speed of rewinding
    let drawBreak = 10; // delay after drawing before the next path starts
    let rewindBreak = 1000; // delay after rewinding before the next drawing starts
    let acceleration = 0.75; // acceleration rate for the first path of a drawing
    let useAcceleration = true; // flag for using acceleration for the first path

    // Function for drawing a path
    const draw = async (line, totalLength, isFirst) => {
        // set initial drawing rate depending on whether this path is the first of a drawing
        let currentDrawRate = isFirst ? 0 : maxDrawRate;
        // draw the path
        for (let i = 0; i <= totalLength; i += currentDrawRate) {
            line.style.strokeDashoffset = totalLength - i;
            await new Promise(r => setTimeout(r, 10)); // delay for smooth animation
            // if this is the first path and acceleration is enabled, gradually increase drawing rate
            if (isFirst && useAcceleration && currentDrawRate < maxDrawRate) {
                currentDrawRate += acceleration;
            }
        }
    }

    // Function for rewinding a path
    const rewind = async (line, totalLength) => {
        // rewind the path
        for (let i = totalLength; i >= 0; i -= rewindRate) {
            line.style.strokeDashoffset = totalLength - i;
            await new Promise(r => setTimeout(r, 10)); // delay for smooth animation
        }
        line.style.strokeDashoffset = totalLength; // reset stroke offset for next drawing
    }

    // On mount, start the animation loop
    onMount(async () => {
        while (true) { // infinite loop for continuous animation
            // randomly select a drawing
            selectedDrawing = drawingArray[Math.floor(Math.random() * drawingArray.length)];
            await tick(); // ensure DOM update

            // calculate total path lengths
            totalLengths = lines.map(line => {
                let length = line.getTotalLength();
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
                return length;
            });

            // break before drawing
            await new Promise(r => setTimeout(r, drawBreak));

            // draw each path in the selected drawing
            for (let i = 0; i < selectedDrawing.length; i++) {
                let line = lines[i];
                line.style.visibility = "visible";
                await draw(line, totalLengths[i], i === 0);
            }

            // break before rewinding
            await new Promise(r => setTimeout(r, rewindBreak));

            // rewind each path in the selected drawing in reverse order
            for (let i = selectedDrawing.length - 1; i >= 0; i--) {
                let line = lines[i];
                await rewind(line, totalLengths[i]);
                line.style.visibility = "hidden"; // hide the line after rewinding
            }
        }
    });
</script>

<style>
    /* Style for the drawing lines */
    .line {
        stroke: white;
        stroke-width: 3;
        fill: none;
        transition: stroke-dashoffset 10ms linear; /* smooth transition for drawing and rewinding */
    visibility: hidden; /* initially hidden */
    }
</style>

<!-- SVG element to draw the paths -->
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    {#each selectedDrawing as path, i (path)}
        <!-- Create a path element for each path in the selected drawing -->
        <path bind:this={lines[i]} class="line" d={path} style="stroke-dashoffset: 9999999" />
    {/each}
</svg>