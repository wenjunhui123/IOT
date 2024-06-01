import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useChannelStore = defineStore("channel", () => {
  const channelNode = ref<{nodeId:number,portalMode:string,portType:string}>();
  const isJumpChannel = ref(false);
  function changeChannelNode(channel: {nodeId:number,portalMode:string,portType:string}) {
    channelNode.value = channel;
  }
  function changeJumpChannelStatus(val: boolean) {
    isJumpChannel.value = val;
  }

  return { channelNode,isJumpChannel, changeChannelNode,changeJumpChannelStatus };
});
