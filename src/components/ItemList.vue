<template>
    <ul>
<li v-for="item in itemList" :key="item.id">
    {{item.item_name}}
    <ItemImage :url='item.item_preview_url'/>
    <p>{{item.condition}}</p>
   
    <p>{{item.description}}</p>
    
</li>
    </ul>
    
</template>
<script>
import { supabase } from "../supabase";
import { ref, onMounted } from "vue";
import ItemImage from "./ItemImage.vue";

export default {
    components: { ItemImage },
    setup() {
        const loading = ref(true);
        const itemList = ref([]);
        async function getItems() {
            try {
                const { data, error } = await supabase
                    .from("items")
                    .select();
                if (error && status !== 406)
                    throw error;
                if (data) {
                    itemList.value = data;
                }
            } catch (error) {
                alert(error.message)
            }
            finally {
                loading.value = false;
            }
        }
        onMounted(() => {
            getItems();
        });
        return { itemList };
    },
};
</script>
