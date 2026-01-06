// composables/usePosts.js
export const usePosts = () => {
  const client = useSupabaseClient()
  const posts = ref([])

  // 1. 목록 가져오기
  const fetchPosts = async () => {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('post_created', { ascending: false })
    
    if (data) posts.value = data
    if (error) console.error(error)
  }

  // [수정] 게시글 쓰기 함수 (이미지 URL도 같이 받도록 수정)
  const createPost = async (content, imageUrl = null) => { // imageUrl 추가됨
    const { data: { user } } = await client.auth.getUser()
    if (!user) return alert('로그인이 필요합니다.')

    const { error } = await client.from('posts').insert({
      user_id: user.id,
      email: user.email,
      content: content,
      image_url: imageUrl // 👈 DB에 주소 저장!
    })

    if (error) alert('글쓰기 실패: ' + error.message)
    else await fetchPosts()
  }
  
  // ✅ 3. 게시글 삭제 (이미지 파일도 함께 삭제하도록 수정)
  const deletePost = async (id) => {
    const confirmDelete = confirm('정말 이 게시글을 삭제하시겠습니까?')
    if (!confirmDelete) return

    // 1. 먼저 삭제할 게시글의 정보를 가져와서 이미지 URL을 확인합니다.
    const { data: post } = await client
      .from('posts')
      .select('image_url')
      .eq('id', id)
      .single()

    // 2. 이미지가 있다면 Storage에서도 삭제합니다.
    if (post && post.image_url) {
      // URL에서 파일명만 잘라내고, 한글/특수문자 등을 원래대로 복구(디코딩)합니다.
      const rawFileName = post.image_url.split('/').pop()
      const fileName = decodeURIComponent(rawFileName)
      
      const { error: storageError } = await client.storage
        .from('images')
        .remove([fileName])
      
      if (storageError) {
        console.error('Storage 이미지 삭제 실패 (권한이나 파일명 확인 필요):', storageError)
        alert('이미지 파일 삭제 실패: ' + storageError.message) // 에러 확인용
      }
    }

    // 3. 이제 DB에서 게시글을 삭제합니다.
    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      posts.value = posts.value.filter(post => post.id !== id)
      alert('삭제되었습니다.')
    }
  }

  // [신규 기능] 📸 이미지 업로드 함수
  const uploadImage = async (file) => {
    // [수정] 한글 파일명 에러 원천 차단 -> 영문 난수 이름 사용
    // 예: "이력서 사진.jpg" -> "1721000..._xy12z.jpg"
    const fileExt = file.name.split('.').pop() // 확장자 추출 (예: jpg)
    const randomString = Math.random().toString(36).substring(2, 10) // 랜덤 문자열
    const fileName = `${Date.now()}_${randomString}.${fileExt}`

    // 2. Storage(images 버킷)에 파일을 업로드합니다.
    const { data, error } = await client.storage
      .from('images') // 아까 만든 버킷 이름
      .upload(fileName, file)

    if (error) {
      console.error('업로드 실패:', error)
      alert('이미지 업로드 실패: ' + error.message) // 👈 에러 내용을 화면에 띄움
      return null
    }

    // 3. 업로드 성공하면, 그 파일의 '공개 주소(URL)'를 받아옵니다.
    const { data: publicUrlData } = client.storage
      .from('images')
      .getPublicUrl(fileName)

    // 4. 주소를 반환합니다. (DB에 넣기 위해)
    return publicUrlData.publicUrl
  }
  return {
    posts,
    fetchPosts,
    createPost,
    deletePost,
    uploadImage // 👈 밖에서 쓸 수 있게 내보내기
  }
}