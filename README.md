# Grandbois for Game Park

This is the implementation of board game "Grandbois" for Game Park (https://game-park.com/)

### Deployment
Command line to deploy a new version (credential must be configured first!):

`yarn build`

`rclone sync ./build grandbois:grandbois.game-park.com --progress --s3-acl=public-read`