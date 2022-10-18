import { supabase } from "../supabase";

export const fetchAvatar = async () => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .getPublicUrl(avatar_url.value);
};

export async function getUserRatings() {
  const { data, error } = await supabase.rpc("ave_user_rating");
  return data;
}
