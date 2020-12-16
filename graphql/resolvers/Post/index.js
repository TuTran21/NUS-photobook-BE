import User from "../../../mongoose/models/User/index.js";
import Post from "../../../mongoose/models/Blog/Post.js";
import Comment from "../../../mongoose/models/Blog/Comment.js";

import { transformPost } from "../merge.js";
import { decryptUserToken } from "../../../utils/utils.js";
import ApolloServer from 'apollo-server'

const {ApolloError} = ApolloServer
export default {
  Query: {
    post: async (parent, { id }, context, info) => {
      try{
      let post = await Post.findById(id).populate('author').exec();
      if (!post){
        throw Error('No post found')
      }

      post.views = post.views + 1 
      post.save()
      return {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        image: post.image,
        views: post.views,
        isPublished: post.isPublished,
        author: post.author,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      };
    } catch(err){
      return err
    }
    },
    posts: async (parent, args, { offset = 0, limit = 0 }, info) => {
      const res = await Post.find({}).populate('author')          .sort({
        "post.views": "ascending",
      }).skip(offset)
      .limit(limit).exec();

       const data = res.map((post) => {
        return  {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        image: post.image,
        views: post.views,
        isPublished: post.isPublished,
        author: post.author,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }});
      return data
    },
  },
  Mutation: {
    createPost: async (parent, { post }, context, info) => {
      try {
      const token = context.req.headers.xtoken;
      const author = await decryptUserToken(token);
      const findAuthor = await User.findById(author.userId);
      
      if (!findAuthor) {
        throw new Error("Token invalid.");
      }

      const newPost = await new Post({
        title: post.title,
        content: post.content,
        image: post.image,
        isPublished: post.isPublished,
        author: findAuthor,
        createdAt: post.createdAt
      });

      newPost.save()

        findAuthor.posts.push(newPost);
        await findAuthor.save();
        return {status: 200, message: "Success"};
      } catch (error) {
        throw error;
      }
    },
    updatePost: async (parent, { post }, context, info) => {
      try{
      const token = context.req.headers.xtoken;
      const author = await decryptUserToken(token);
      const findAuthor = await User.findById(author.userId);
       
      if (!findAuthor) {
        throw new Error("Token invalid.");
      }


      await  Post.findByIdAndUpdate(post.id, { $set: { ...post } })
        
        return {status: 200, message: "Success"}
      }catch(err){
        throw err
      }
    },
    deletePost: async (parent, { _id }, context, info) => {
      try {
        // searching for creator of the post and deleting it from the list
        const post = await Post.findById(_id);
        const creator = await User.findById(post.author);
        if (!creator) {
          throw new Error("Token invalid.");
        }
        const index = creator.posts.indexOf(_id);
        if (index > -1) {
          creator.posts.splice(index, 1);
        }
        await creator.save();
        return new Promise((resolve, reject) => {
          Post.findByIdAndDelete(_id).exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
        
    deleteManyPosts: async (parent, { posts }, context, info) => {
      try{
      const token = context.req.headers.xtoken;
      const admin = await decryptUserToken(token);
      const findAdmin = await User.findById(admin.userId);
      const userType = findAdmin.userType;
      if (userType !== "ADMIN") {
        throw new ApolloError("Only admins can perform this action", 403);
      }


        await Post.deleteMany({
          _id: {
            $in: posts
          }
        }
      );
      return {
        status: 200,
        message: "Success"
      }
    }catch(err){
      return err
    }
    }
  },
  Subscription: {
    post: {
      subscribe: (parent, args, { pubsub }) => {
        //return pubsub.asyncIterator(channel)
      },
    },
  },
  Post: {
    author: async ({ author }, args, context, info) => {
      return await User.findById(author);
    },
    // comments: async ({ author }, args, context, info) => {
    //   return await Comment.find({ author });
    // },
  },
};
