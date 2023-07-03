<script>
    import Drawing from "./Drawing.svelte";
    import {
        circle,
        cubeFlip,
        flame,
        loadBar, nathanGandalf,
        spikyBall, threeLines,
        benchmark,
        porterHand

    } from "./drawings";
    let drawingList = [
        $porterHand
    ];
</script>

<Drawing drawingList={drawingList}/>
