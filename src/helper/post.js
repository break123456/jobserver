exports.getPostByOwnerId = async (ownerId)=>{
    try {
      let posts = await Post.find({ ownerId: ownerId });
      return ({ posts: posts, msg: "success" })
    } catch (error) {
      console.log("error: ", error);
      return ({ error: error.message, msg: "Post filter failed" })
    }
}