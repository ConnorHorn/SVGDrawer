<script>
    import { onMount } from 'svelte';
    import {
        circle,
        cubeFlip,
        cubeVortex,
        dualRainbow, flame,
        floweryCircle,
        guyWaving,
        loadBar,
        spikyBall,
        spiral,
        squareRays
    } from "./drawings";

    let maxDrawRate = 100; // maximum draw rate
    let rewindRate = 500; // adjust this to your needs
    let drawBreak = 1000; // break after drawing in ms
    let rewindBreak = 1000; // break after rewinding in ms
    let acceleration = 0.75; // adjust this to your needs
    let useAcceleration = true; // change this to control whether to use acceleration
    let progress = 0;
    let totalLength;
    let line; // Declare a variable to hold the reference to the SVG path

    onMount(async () => {
        totalLength = line.getTotalLength();
        line.style.strokeDasharray = totalLength;
        line.style.strokeDashoffset = totalLength;
        let currentDrawRate = 0; // start at 0 draw rate

        while (true) {
            for (let i = 0; i <= totalLength; i += currentDrawRate) {
                progress = i;
                await new Promise(r => setTimeout(r, 10));
                if (useAcceleration && currentDrawRate < maxDrawRate) {
                    currentDrawRate += acceleration;
                }
            }

            await new Promise(r => setTimeout(r, drawBreak)); // break after drawing

            for (let i = totalLength; i >= 0; i -= rewindRate) {
                progress = i;
                await new Promise(r => setTimeout(r, 10));
            }

            line.style.strokeDashoffset = totalLength; // ensure the line is fully hidden

            await new Promise(r => setTimeout(r, rewindBreak)); // break after rewinding

            currentDrawRate = 0; // reset currentDrawRate
        }
    });
</script>

<style>
    #line {
        stroke: white;
        stroke-width: 3;
        fill: none;
        transition: stroke-dashoffset 10ms linear;
    }
</style>

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <path bind:this={line} id="line" d={$flame} style="stroke-dashoffset: {totalLength - progress}" />
</svg>