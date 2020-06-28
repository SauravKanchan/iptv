<script>
  export let name;
  import axios from 'axios';
  import M3U8FileParser from 'm3u8-file-parser';

  function getLogo(obj){
    if(obj.inf){
      if(obj.inf.tvgLogo){
        return obj.inf.tvgLogo
      }
      return obj.inf.logo
    }
  }

  let data = [];
  (async () => {
    let res = await axios.get("https://raw.githubusercontent.com/billacablewala/m3u8/master/README.md");
    let reader = new M3U8FileParser();
    let urls = res.data.
    replace(/= "/g, '="').
    replace(/EXTINF:0,/g, 'EXTINF:0 ').
    replace(/EXTINF:-1,/g, 'EXTINF:-1 ').
    replace(/ttvg-logo/g, 'tvg-logo').
    split("#EXTINF:");

    for (let i = 0; i < urls.length; i++) {
      try {
        if(i!==0){
          reader.read("#EXTINF:"+urls[i]);
        }else{
          reader.read(urls[i]);
        }
      } catch (e) {

      }
    }

    data = reader.getResult().segments;
    for(let i = 0; i< data.length; i++){
      if (!getLogo(data[i])){
          console.log(data[i])
      }
    }
  })();
</script>

<div>
  {#each data as d}
    {#if d.inf}
      <img src="{getLogo(d)}" alt={d.inf.title} class="col-1"/>
    {/if}
  {/each}
</div>

<style>
  .col-1 {
    padding: 2px;
    width: 8.33%;
  }
</style>
