docker compose -f docker-compose.yml up -d

##  Créer un fichier de clé (keyFile)
`openssl rand -base64 756 > mongodb-keyfile
chmod 400 mongodb-keyfile
`
## se connter a mongodb distan

`bash docker exec -it mongodb bash`