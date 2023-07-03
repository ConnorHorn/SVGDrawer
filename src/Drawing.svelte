<script>
    import { onMount, tick } from 'svelte';

    let selectedDrawing = [];
    let lines = [];
    let totalLengths = [];

    let maxDrawRate = 190;
    let rewindRate = 350;
    let drawBreak = 10;
    let rewindBreak = 1000;
    let acceleration = 0.7;
    let useAcceleration = true;
    let currentDrawRate = 0;  // declare the global variable

    export let drawingList = [];

    const draw = async (line, totalLength, isFirst) => {
        if (isFirst) currentDrawRate = 0;  // reset currentDrawRate for the first path of a new drawing
        for (let i = 0; i <= totalLength; i += currentDrawRate) {
            line.style.strokeDashoffset = totalLength - i;
            await new Promise(r => setTimeout(r, 10));
            if (useAcceleration && currentDrawRate < maxDrawRate) {
                currentDrawRate += acceleration; // increase draw rate until it reaches maxDrawRate
            }
        }
    }

    const rewind = async (line, totalLength) => {
        for (let i = totalLength; i >= 0; i -= rewindRate) {
            line.style.strokeDashoffset = totalLength - i;
            await new Promise(r => setTimeout(r, 10));
        }
        line.style.strokeDashoffset = totalLength;
    }

    onMount(async () => {
        while (true) {
            selectedDrawing = drawingList[Math.floor(Math.random() * drawingList.length)];
            await tick();

            totalLengths = lines.map(line => {
                let length = line.getTotalLength()+120;
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
                return length;
            });


            await new Promise(r => setTimeout(r, drawBreak));

            for (let i = 0; i < selectedDrawing.length; i++) {
                let line = lines[i];
                line.style.visibility = "visible";
                await draw(line, totalLengths[i], i === 0);
            }

            await new Promise(r => setTimeout(r, rewindBreak));

            for (let i = selectedDrawing.length - 1; i >= 0; i--) {
                let line = lines[i];
                await rewind(line, totalLengths[i]);
                line.style.visibility = "hidden";
            }
        }
    });
</script>

<style>
    .line {
        stroke: white;
        stroke-width: 3;
        fill: none;
        transition: stroke-dashoffset 10ms linear;
        visibility: hidden;
    }
</style>

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    {#each selectedDrawing as path, i (path)}
        <path bind:this={lines[i]} class="line" d={path} style="stroke-dashoffset: 9999999" />
    {/each}
</svg>