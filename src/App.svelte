<script>
  export let name;
  import axios from 'axios';
  import M3U8FileParser from 'm3u8-file-parser';

  let data = [];
  (async () => {
    let res = await axios.get("https://raw.githubusercontent.com/billacablewala/m3u8/master/README.md");
    let reader = new M3U8FileParser();
    let urls = res.data.split("\n");
    // console.log(reader.getResult());
    for(let i = 0; i< urls.length; i++){
      try{
        reader.read(urls[i]);
      }catch (e) {

      }
    }

    data = reader.getResult().segments;
    console.log(data[10]);
  })();
</script>

{#each data as d}
{/each}
