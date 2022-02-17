Telechargez d'abord le code, puis installez VSCODE sur votre ordinateur.

installer Node sur votre ordinateur.

Ensuite ouvrez le fichier telecharger (le code) avec vscode

avec l'aide du terminal positionner vous dans le dossier frontend, et executer la commande npm install
et toujours avec le terminal positionner vous dans le dossier backend, et executer npm install

Tout ceci devrait installer les packeges necessaires pour le bon execution du code.

dans le terminal, position frontend, executer npm run serve, ceci doit lancer le navigateur sur http://localhost:8080/


BACKEND
Vous devez avoir MySQL installé en localhost sur le port 3306.
Puis dans le dossier backend/config configurer le fichier avec les données qui vous sont propre à vous.
Mais je vous conseilles de créer une base de données avec le nom groupomania, et deux tables users et posts, les champs a remplir vous trouverez dans le dossier models.

Vous pouvez utiliser ces commandes SQL pour plus de simplicité:

```
CREATE DATABASE groupomania;
```
Cette commande doit automatiquement creer les tables dans la DB groupomania (si l'utilisateur de mysql a TOUS les privilèges - reglages dans mysql...)



puis dans le terminal, position backend, executer nodemon server, ceci doit lancer la connexion au serveur

