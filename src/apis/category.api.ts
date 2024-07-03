import http from 'src/utils/http'
import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/utils.type'
import { ProductListConfig } from 'src/types/product.type'

const URL = 'categorys'

const categoryApi = {
  getCategories(params: ProductListConfig) {
    return http.get<SuccessResponse<Category[]>>(URL, {
      params
    })
  },
  deleteCategories(params: string) {
    return http.delete<SuccessResponse<Category[]>>(`${URL}/${params}`)
  }
}

export default categoryApi
