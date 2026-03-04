import OrderController from '../controllers/OrderController.js'
import ProductController from '../controllers/ProductController.js'
import RestaurantController from '../controllers/RestaurantController.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileUploadMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkRestaurantOwnership } from '../middlewares/RestaurantMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants')
    .get(
      RestaurantController.index)
    .post(
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['logo', 'heroImage'], process.env.RESTAURANTS_FOLDER), // se pone el campo del modelado
      handleValidation,
      RestaurantController.create)

  app.route('/restaurants/:restaurantId')
    .get(
      checkEntityExists('Restaurant', 'restaurantId'),
      RestaurantController.show)
    .put(
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['logo', 'heroImage'], process.env.RESTAURANTS_FOLDER),
      handleValidation,
      checkRestaurantOwnership,
      checkEntityExists('Restaurant', 'restaurantId'),
      RestaurantController.update)
    .delete(
      isLoggedIn,
      hasRole('owner'),
      checkRestaurantOwnership,
      checkEntityExists('Restaurant', 'restaurantId'),
      handleValidation,
      RestaurantController.destroy)

  app.route('/restaurants/:restaurantId/orders')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkRestaurantOwnership,
      checkEntityExists('Restaurant', 'restaurantId'),
      OrderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(
      checkEntityExists('Restaurant', 'restaurantId'),
      ProductController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkRestaurantOwnership,
      checkEntityExists('Restaurant', 'restaurantId'),
      OrderController.analytics)
}
export default loadFileRoutes
