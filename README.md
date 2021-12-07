# Aavenluutn
(AH-ven-LOO-tn)
Adventure stories in the lootverse

## Dev env requirements

* docker
* jq

## To publish the UI to the backend

First, in the react folder, build the UI and move the build artifact
to the backend

```
react/ $ yarn build
react/ $ yarn backend
```

Then build the backend and run it locally

```
echo/ $ source wake
echo/ $ wake build
echo/ $ wake run
```

## To deploy the backend

First build the backend as above then publish. This will require being
logged into the "emblem" docker hub account. TODO put those
credentials on keybase

`echo/ $ wake publish`