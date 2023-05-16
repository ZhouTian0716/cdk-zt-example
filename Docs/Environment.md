# Environment

Environment is set by environment variable `CRM_ENV`, but in frontend and backend are using slightly different way

## Frontend

if `CRM_ENV` is prod, then it is `prod`, otherwise it is `dev`

## Backend

`CRM_ENV` can be a environment name, such as `dave`, `ryan` or `kev`.
If `CRM_ENV` is prod, then it is `prod`.

The reason behind that is even for `dev`, we can setup aws differently.
