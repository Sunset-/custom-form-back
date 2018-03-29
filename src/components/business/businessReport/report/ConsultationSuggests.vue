<template lang="html">
  <div class="report-history-container">
    <div class="report-history" v-for="item in list ">
      <div class="history-title">
        <h2>{{item.saveWriter.designation}}</h2>
        <p>{{item.writeTime|time 'yyyy-MM-dd HH-mm'}}</p>
      </div>
      <div class="history-body">
        <div>
          <strong>影像所见</strong>
          <span>{{{item.imagingFinding}}}</span>
        </div>
        <div>
          <strong>影像提示</strong>
          <span>{{{item.imagingTips}}}</span>
        </div>
        <div class="">
          <strong>建议</strong>
          <span>{{item.suggests}}</span>
        </div>
        <div class="">
          <strong>报告标签</strong>
          <span>{{{2:'阳性',3:'阴性'}[item.positiveNegative]}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Report
  } from '../service';
  export default {
    props: {
      list: {
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {};
    },
    ready() {

    }
  }
</script>

<style lang="sass">
  .report-history-container {
    max-height: 500px;
    overflow-y: auto;
    .report-history {
      border-bottom: 1px solid #ccc;
      &:last-child {
        border-bottom: 0px;
      }
      .history-title {
        margin: 10px 0px;
        h2 {
          display: inline-block;
        }
        p {
          display: inline-block;
        }
      }
      .history-body {
        >div {
          margin: 5px 0px;
          >span {
            text-indent: 2em;
          }
        }
      }
    }
  }
</style>