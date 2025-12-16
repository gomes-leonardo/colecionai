/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           description: "Must contain uppercase, lowercase, number and special character"
 *           example: "SecurePass123!"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "SecurePass123!"
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - category
 *         - condition
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: "Funko Pop Batman"
 *         price:
 *           type: integer
 *           description: "Price in cents"
 *           example: 9999
 *         description:
 *           type: string
 *           minLength: 10
 *           example: "Rare Funko Pop Batman figure from 2020"
 *         category:
 *           type: string
 *           enum: [ACTION_FIGURES, COLLECTIBLE_STATUES, FUNKO_POP, TRADING_CARDS, COMIC_BOOKS, MANGA, RETRO_GAMES, MINIATURES, MODEL_KITS, MOVIES_TV_COLLECTIBLES, ANIME_COLLECTIBLES, ART_BOOKS, RARE_COLLECTIBLES]
 *           example: "FUNKO_POP"
 *         condition:
 *           type: string
 *           enum: [NEW, USED, OPEN_BOX]
 *           example: "NEW"
 *
 *     CreateAuctionRequest:
 *       type: object
 *       required:
 *         - product_id
 *         - start_price
 *         - start_date
 *         - end_date
 *       properties:
 *         product_id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         start_price:
 *           type: integer
 *           description: "Starting price in cents"
 *           example: 5000
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2024-12-20T10:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2024-12-22T10:00:00Z"
 *
 *     CreateBidRequest:
 *       type: object
 *       required:
 *         - auction_id
 *         - amount
 *       properties:
 *         auction_id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         amount:
 *           type: integer
 *           description: "Bid amount in cents"
 *           example: 5500
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           example: "ABC123"
 *         password:
 *           type: string
 *           minLength: 8
 *           example: "NewSecurePass123!"
 *
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           example: "ABC123"
 *
 *     ListProductsQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         per_page:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         category:
 *           type: string
 *           enum: [ACTION_FIGURES, COLLECTIBLE_STATUES, FUNKO_POP, TRADING_CARDS, COMIC_BOOKS, MANGA, RETRO_GAMES, MINIATURES, MODEL_KITS, MOVIES_TV_COLLECTIBLES, ANIME_COLLECTIBLES, ART_BOOKS, RARE_COLLECTIBLES]
 *         condition:
 *           type: string
 *           enum: [NEW, USED, OPEN_BOX]
 *         name:
 *           type: string
 *
 *     ListAuctionsQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         per_page:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         category:
 *           type: string
 *         condition:
 *           type: string
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentication successful, token set in HTTP-only cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user (clear JWT cookie)
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Verify user email with token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
/**
 * @swagger
 * /verify/resend:
 *   post:
 *     summary: Resend verification email token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification token sent
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset token sent to email
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: List all products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ACTION_FIGURES, COLLECTIBLE_STATUES, FUNKO_POP, TRADING_CARDS, COMIC_BOOKS, MANGA, RETRO_GAMES, MINIATURES, MODEL_KITS, MOVIES_TV_COLLECTIBLES, ANIME_COLLECTIBLES, ART_BOOKS, RARE_COLLECTIBLES]
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [NEW, USED, OPEN_BOX]
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     per_page:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the product owner
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the product owner
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /products/me:
 *   get:
 *     summary: Get current user's products
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /products/{id}/image:
 *   patch:
 *     summary: Update product banner image
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the product owner
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /auctions:
 *   post:
 *     summary: Create a new auction
 *     tags: [Auctions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAuctionRequest'
 *     responses:
 *       201:
 *         description: Auction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /auctions:
 *   get:
 *     summary: List all auctions with pagination and filters
 *     tags: [Auctions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auctions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Auction'
 *                 pagination:
 *                   type: object
 */
/**
 * @swagger
 * /auctions/me:
 *   get:
 *     summary: Get current user's auctions
 *     tags: [Auctions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auction'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /auctions/details/{id}:
 *   get:
 *     summary: Get auction details with product and bids
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Auction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auction:
 *                   $ref: '#/components/schemas/Auction'
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *                 highest_bid:
 *                   $ref: '#/components/schemas/Bid'
 *       404:
 *         description: Auction not found
 */
/**
 * @swagger
 * /auctions/{id}:
 *   put:
 *     summary: Update an auction
 *     tags: [Auctions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAuctionRequest'
 *     responses:
 *       200:
 *         description: Auction updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the auction owner
 *       404:
 *         description: Auction not found
 */
/**
 * @swagger
 * /auctions/{id}:
 *   delete:
 *     summary: Delete an auction
 *     tags: [Auctions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Auction deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the auction owner
 *       404:
 *         description: Auction not found
 */
/**
 * @swagger
 * /bids:
 *   post:
 *     summary: Create a new bid on an auction
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBidRequest'
 *     responses:
 *       201:
 *         description: Bid created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bid'
 *       400:
 *         description: Validation error (bid too low, auction closed, etc.)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Auction not found
 */
