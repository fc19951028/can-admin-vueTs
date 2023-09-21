
import http from './http';

export const deleteListApi = (url: string, data: object) => http.delete(url, { params: data });
export const getListApi = (url: string, data?: object) => http.get(url, { params: data });
export const addListApi = (url: string, data: object) => http.post(url, data);
export const editListApi = (url: string, data: object) => http.put(url, data);



export const loginApi = (data: object) => http.post('/login', data);
export const getRoutes = () => http.get('/getRoutes');
export const editPermissions = (data: object) => http.put('/permissions', data);
export const getInfo = () => http.get('/getInfo');
// interface Response<T> {
//     code: number
//     data: T,
//     message: string
// }
// interface ResponseToken {
//     token: string
// }
// type Result<T=any> = Promise<Response<T>>;
// // export const Demo = (data:object):Pro<string> => request.post('/Demo', data);


// export const deleteListApi = (url:string,data:object):Result<string> => request.delete(url, { params:data });
// export const getListApi = (url:string,data:object):Result<[]> => request.get(url, { params:data });
// export const addListApi = (url:string,data:object):Result<string> => request.post(url, data);
// export const editListApi = (url:string,data:object):Result<string> => request.put(url, data);

// export const loginApi = (data:object):Result<ResponseToken> => request.post('/login', data);
// export const getDepartmentApi = (data:object):Result<[]> => request.get('/department', { params:data });
// export const postDepartmentApi = (data:object):Result<string> => request.post('/department', data);
// export const deleteDepartmentApi = (data:object):Result<string> => request.delete('/department', { params:data });
// export const putDepartmentApi = (data:object):Result<string> => request.put('/department', data);










