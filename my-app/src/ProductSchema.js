import { object, string, number, mixed } from 'yup';

const ProductSchema = object().shape({
    name: string().required(),
    price: number().typeError("enter a number").required("should be a number").positive(),
    description: string().required(),
    files: mixed().test({
        name: 'files',
        test(files, ctx) {
          if (files.length < 1) {
            return ctx.createError({ message: 'require minimum 1 file' })
          }
          if ((files.length > 6)) {
            return ctx.createError({ message: 'maximum files can be 6' })
          }
         
          return true
        }
      })
  });


  export default ProductSchema;