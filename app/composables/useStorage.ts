export const useStorage = () => {
  const supabase = useSupabaseClient()

  // 이미지 업로드
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // 한글 파일명 등 깨짐 방지를 위해 난수명 사용 권장
    const filePath = `${fileName}`

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (error) throw error
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)
      
    return data.publicUrl
  }

  // 이미지 삭제 (URL 기준)
  const deleteImage = async (imageUrl: string) => {
    try {
      const urlObj = new URL(imageUrl)
      const pathSegments = urlObj.pathname.split('/public/images/')
      
      if (pathSegments.length > 1) {
        const filePath = decodeURIComponent(pathSegments[1])
        const { error } = await supabase.storage
          .from('images')
          .remove([filePath])
          
        if (error) console.error('Storage Delete Error:', error)
      }
    } catch (e) {
      console.error('Invalid Image URL:', e)
    }
  }

  return {
    uploadImage,
    deleteImage
  }
}
