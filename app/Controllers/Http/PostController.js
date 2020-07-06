'use strict'
// models
const Post = use('App/Models/Post')
// validator
const { validate } = use('Validator');
class PostController {
    async index({ view }) {
        // const posts =[
        //         {title:'post 1',body:'This is post 1'},
        //         {title:'post 2',body:'This is post 2'},
        //         {title:'post 3',body:'This is post 3'},
        // ];
        const posts = await Post.all()

        return view.render('post.index', {
            titles: "param pass",
            age: 11,
            post: posts.toJSON()
        });
    }
    async details({ params, view }) {
        const post = await Post.find(params.id)
        return view.render('posts.details', {
            post: post
        });
    }

    async add({ view }) {
        return view.render('posts.add');
    }
    async create({ view, params }) {
        return view.render('posts.add');
    }
    async store({ request, response, session }) {
        // validate input
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })
        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back');
        }

        const post = new Post();
        post.title = request.input('title');
        post.body = request.input('body');
        await post.save();
        session.flash({ notification: 'post Added!' })
        response.redirect('/posts');
    }

    async edit({ params, view }) {
        const post = await Post.find(params.id);
        return view.render('posts/edit', {
            post: post
        });
    }

    async update({ params, view, request, response,session }) {

        // update validation
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })
        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back');
        }

        const post = await Post.find(params.id);
        post.title = request.input('title');
        post.body = request.input('body');

        await post.save();
        // session.flash({notification:'post Updated'});
        session.flash({ notification: 'post updated!' })
        return response.redirect('/posts');
    };

    async delete({params,session,response}){
        const post = await Post.find(params.id);
        await post.delete();
        session.flash({ notification: 'post Deleted!' })
        return response.redirect('/posts');
    }



}

module.exports = PostController
