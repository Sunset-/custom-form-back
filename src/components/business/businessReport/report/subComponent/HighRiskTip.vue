<template lang="html">
    <div class="">
        <p>1、中枢神经系统：①严重的颅内血肿、脑干出血；②脑挫伤、蛛网膜下腔出血急性期；③脑疝；④颅脑CT或MRI扫描诊断为颅内急性大面积脑梗死（范围达到一个脑叶或全脑干范围或以上）；⑤脑出血或脑梗塞复查CT或MRI，出血或梗塞程度明显加重。</p>
        <p>2、脊柱、脊髓疾病： CT/MRI检查诊断为脊柱外伤后压迫脊髓/脊髓横断损伤。</p>
        <p>3、呼吸系统：①气管、支气管异物；②液气胸，尤其是张力性气胸；压缩≥80%③肺栓塞、肺梗塞。</p>
        <p>4、循环系统：急性主动脉夹层动脉瘤。</p>
        <p>5、消化系统：①食道异物；②消化道穿孔、梗阻；③急性胆道梗阻；④急性出血坏死性胰腺炎；⑤肝、脾、胰、肾等腹腔脏器出血。</p>
    </div>
    <div class="footer" >
        <i-button type="primary" @click="ok()">确认</i-button>
        <i-button type="ghost" @click="cancel()">取消</i-button>
    </div>
    <div class="clearfix"></div>
</template>

<script>
export default {
    props:{
        ok:{
            default:function(){
                return null;
            }
        },
        cancel:{
            default:function(){
                return null;
            }
        }

    },
    ready(){
    }
}
</script>

<style lang="sass" scoped>
    .footer{
        float:right;
    }
    .clearfix{
        clear:both;
    }
</style>
