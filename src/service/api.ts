
import request from '@/service/index'
export interface Question {
  cp_name?: string,
  lang: string,
  cp: string,

}
export interface Submit {
  cp_name: string,
  lang: string,
  id: number,
  option: string
}
export const questionList = (data: Question) => {
  return request({ url: `/api/h5/question/list`, method: 'POST', data })
}
export const questionSubmit = (data: Submit) => {
  return request({ url: `/api/h5/question/submit`, method: 'POST', data })
}
export const questionAnswer = ({ lang, cp_name }: { lang: string, cp_name: string }) => {
  return request({ url: `/api/h5/question/answer/?lang=${lang}&cp_name=${cp_name}`, method: 'GET' })
}
