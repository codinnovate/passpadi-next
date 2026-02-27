"use server"
import axios from 'axios' 
import { serverApp } from "../../server";

export const getSingleArticle = async (postId:string) => {
    try {
        const response = await axios.post(`${serverApp}/get-blog/`,
             {blog_id:postId}
            )
        const data = response.data?.blog;
        return data;
    } catch (error) {
        console.log(error)
        
    } 
}

export const getQuestionsBySubject = async (subject:string) => {
    try {
        const response = await axios.get(`${serverApp}/questions/v1/${subject}`)
        const data = response.data;
        return data;
    } catch (error) {
        console.log(error)

    }
}


export const getAllSubjects = async () => {
    try {
        const response = await axios.get(`${serverApp}/subjects`)
        const data = response.data;
        return data;
    } catch (error) {
        console.log(error)
        
    }
}

export const fetchLatestArticles = async (page:number) => {
    try {
        const response = await axios.post(`${serverApp}/latest-blogs`, {page: 1} )
        const data = response.data;
        return data;
    } catch (error) {
        console.log(error)
    }
}


export const getQuestion = async (question_id:string) => {
    try {
        const response = await axios.get(`${serverApp}/questions/one/${question_id}`)
        const data = response.data;
        return data;
    } catch (error) {
        console.log(error)
    }
}