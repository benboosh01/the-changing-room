<script>
import { supabase } from '../supabase';
import { onMounted, ref } from 'vue';
import { useStore } from '../store';

export default {
  emits: ['toggleUpload', 'addNewItem'],
  setup(_, context) {
    const store = useStore();
    const loading = ref(false);
    const item_name = ref('');
    const description = ref('');
    const category_id = ref(null);
    const condition = ref('');
    let item_preview_url = ref('');
    const categoryList = ref([]);
    const conditionList = ref([]);
    const acceptDonation = ref(false);
    const donationAmount = ref(0);
    const uploadedData = ref({});

    async function uploadItemForm() {
      try {
        loading.value = true;

        const file = item_preview_url.value[0];

        if (!file.name) return 'ERROR';

        // todo - owner_id is hardcoded, user login must be working to send this
        const data = {
          item_name: item_name.value,
          description: description.value,
          category_id: category_id.value,
          condition: condition.value,
          item_preview_url: file.name,
          owner_id: store.user.id,
          owner_username: store.user.username,
          accept_donation: acceptDonation.value,
          donation_amount: donationAmount.value,
        };

        const { error } = await supabase.from('items').insert(data);
        uploadedData.value = data;

        let { error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(file.name, file);

        if (error) throw error;
      } catch (error) {
        console.log('error', error);
        alert(error.message);
      } finally {
        loading.value = false;
        item_name.value = '';
        description.value = '';
        category_id.value = null;
        condition.value = '';
        item_preview_url.value = '';

        alert('Succesfully uploaded item');
        addNewItem();
        toggleUpload();
      }
    }

    async function getCategories() {
      try {
        loading.value = true;
        const { data, error } = await supabase.from('categories').select();

        if (error) throw error;

        if (data) {
          categoryList.value = data;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getCondition() {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from('condition')
          .select()
          .order('id', { ascending: true });

        if (error) throw error;

        if (data) {
          conditionList.value = data;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        console.log(conditionList.value);
      }
    }

    function onFileSelected(event) {
      if (event.target.files.length === 0) {
        return;
      }
      item_preview_url.value = event.target.files;
    }

    function toggleUpload() {
      context.emit('toggleUpload');
    }

    function addNewItem() {
      context.emit('addNewItem', uploadedData.value);
    }

    onMounted(() => {
      getCategories();
      getCondition();
    });

    return {
      loading,
      item_name,
      description,
      category_id,
      condition,
      item_preview_url,
      categoryList,
      conditionList,
      acceptDonation,
      donationAmount,
      uploadItemForm,
      onFileSelected,
    };
  },
};
</script>

<template>
  <form @submit.prevent="uploadItemForm" id="upload-item-form">
    <label for="item_name">Item</label>
    <input
      id="item_name"
      type="text"
      v-model="item_name"
      placeholder="Enter new item"
      required
    />

    <label for="description">Description</label>
    <input
      id="description"
      type="text"
      v-model="description"
      placeholder="Enter item description"
      required
    />

    <label for="category_id">Category</label>

    <select v-model="category_id" required>
      <option value="0" selected disabled>---- Select Category ----</option>
      <option v-for="category in categoryList" :value="category.id">
        {{ category.category_name }}
      </option>
    </select>

    <label for="condition">Condition</label>
    <select v-model="condition" required>
      <option value="0" selected disabled>---- Select Condition ----</option>
      <option v-for="condition in conditionList" :value="condition.condition">
        {{ condition.condition }}
      </option>
    </select>

    <label for="item_preview_url">Image</label>
    <input
      id="item_preview_url"
      type="file"
      @change="onFileSelected($event)"
      placeholder="Choose file to upload"
      accept="image/jpeg, image/png, image/jpg"
      class="input-file"
      required
    />

    <label for="accept-donation">Accept Charity Donation</label>
    <select v-model="acceptDonation" id="accept-donation" required>
      <option :value="false">No</option>
      <option :value="true">Yes</option>
    </select>

    <label v-if="acceptDonation" for="donation-amount">Donation Amount</label>
    <input v-if="acceptDonation" type="number" v-model="donationAmount" />

    <input
      type="submit"
      class="button block primary"
      :value="loading ? 'Loading ...' : 'Submit'"
      :disabled="loading"
    />
  </form>
</template>

<style scoped>
#upload-item-form {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

#upload-item-form > input {
  border: 1px solid grey;
}

#upload-item-form > label,
input,
button,
select {
  width: 375px;
  height: 35px;
}

#upload-item-form > label {
  margin-bottom: -20px;
}

.input-file {
  height: 45px;
}
</style>
