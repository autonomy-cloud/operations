# Backing up a database.

Admin mongodb username is: `root`

Run these on source cluster:

Syntax:

`sudo kubectl exec <pod> -- mongodump --uri="mongodb://<mongousername>:<mongopassword>@localhost:27017/<databasename>" --archive="<export-filepath>"`

Example:

`sudo kubectl exec fi-mongodb-0 -- mongodump --uri="mongodb://cast-operations:password@localhost:27017/castoperationsdb" --archive="/bitnami/mongodb/cast-operationsdata.archive"`

**Step 2**: Copy file from conatiner to local machine.

Syntax:

`sudo kubectl cp <pod>:<filepath> <localfilePath>`

Example:

`sudo kubectl cp fi-mongodb-0:/bitnami/mongodb/cast-operationsdata.archive /Volumes/DataDrive/Projects/Operations/app/backup.archive`
