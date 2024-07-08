import { update } from 'lodash'
import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },
  detailProduct(id: number) {
    return http.get<Product[]>(`${URL}/${id}`)
  },
  deleteProducts(params: string) {
    return http.delete<SuccessResponse<Product[]>>(`${URL}/${params}`)
  },
  addProduct(body: Product) {
    return http.post(URL, body)
  },
  updateProduct(id: number, body: Product) {
    return http.put(`${URL}/update/${id}`, body)
  }
}

export default productApi
