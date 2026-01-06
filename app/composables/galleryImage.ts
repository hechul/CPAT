export const deleteGalleryImageForPost = async (supabase: any, postsTable: string, id: number) => {
  const { data } = await supabase.from(postsTable).select('image_url').eq('id', id).single()
  if (!data?.image_url) return

  try {
    const urlObj = new URL(data.image_url)
    const pathSegments = urlObj.pathname.split('/public/images/')
    if (pathSegments.length > 1) {
      await supabase.storage.from('images').remove([decodeURIComponent(pathSegments[1])])
    }
  } catch (e) {
    console.error('Image delete error:', e)
  }
}
