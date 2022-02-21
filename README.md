Telechargez d'abord le code, 
puis installez VSCODE sur votre ordinateur.

installer Node sur votre ordinateur.
installer Vue CLI
installer mysql

Ensuite ouvrez le fichier telecharger (le code) avec vscode

avec l'aide du terminal positionner vous dans le dossier frontend, et executer la commande npm install
et toujours avec le terminal positionner vous dans le dossier backend, et executer npm install

Tout ceci devrait installer les packeges necessaires pour le bon execution du code. (si le terminal vous demande d'installer d'autres fichiers, faite le necesssaire. Il se peut qu'entre temps, un module a changé de version. Le code dans cet etat fonctionne sur mon ordinateur, j'ai verifié).

dans le terminal, position frontend, executer la commande "npm run serve", ceci doit lancer le navigateur sur http://localhost:8080/
Puis dans le terminal, position dossier backend, executer la commande "nodemon server, ou node server", ceci doit lancer le serveur.


BACKEND
Vous devez avoir MySQL installé en localhost sur le port 3306.
Puis dans le dossier backend/config configurer le fichier avec les données qui vous sont propre à vous. Le mot de passe, le nom du serveur, le nom d'utilisateur.
Créer une base de données avec le nom "groupomania", et deux tables users et posts, les champs a remplir vous trouverez dans le dossier models.
Normalement si vous avez installer tous les plugins qui figure dans le dossier package.json, l'orm sequelize, fera tout a votre place. Mais il faudra créer la base de donnée avec le nom "groupomania", les deux tables et les champs, sequelize s'en chargera.

Ensuite créer un utilisateur pseudo : admin, email: admin@groupomania.com, password: 12345Loki
Et dans la base de données metter la valeur du champs "is_admin" a chiffre 1. Ce sera l'utilisateur admin, qui pourra avoir plus de privileges que les autres utilisateurs, et pourra moderer sur le forum.

puis dans le terminal, position backend, executer nodemon server, ceci doit lancer la connexion au serveur.

