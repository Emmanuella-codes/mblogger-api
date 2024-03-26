# MBLOGGER API

## Technologies used

- Node.js
- Express.js
- MongoDB
- Nodemailer
- JWT

## Test endpoints

### auth

register:POST /api/register
verify email:POST /api/verify-email
login:POST /api/login
forget password:POST /api/forget-password
reset password:POST /api/reset-password

### blog management

create:POST /api/blogs
edit:PUT /api/blogs/:blogId
delete:DELETE /api/blogs/:blogId
get:GET /api/blogs

### Additional

like:POST /api/blogs/:blogId/like
unlike:DELETE /api/blogs/:blogId/unlike
comment:POST /api/blogs/:blogId/comments
delete comment:DELETE /api/blogs/:blogId/comments/:commentId
get user's blogs:GET /api/user/blogs
