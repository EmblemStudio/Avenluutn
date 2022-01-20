# Aavenluutn
(AH-ven-LOO-tn)
Adventure stories in the lootverse

## Dev env requirements

* docker
* jq

## To run locally

1. Start a hardhat node
   `hardhat $ yarn up`
2. Deploy contracts to that node
   `hardhat $ yarn deploy`
3. Build the UI
   `react $ yarn build`
5. Build the script
   `scripts $ yarn build`
7. Build the backend
   `echo $ source wake`
   `echo $ wake build`
8. Run the backend
   `wake run`

## To deploy or add narrators to test nets

You'll need keybase cli set up with the squad_games team file system synced
THIS IS UNTESTED and MIGHT NOT WORK!

## To publish the UI to the backend

First, in the react folder, build the UI and move the build artifact
to the backend

```
react/ $ yarn build
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

## To update original script content
Create any updates in the [google sheet](https://docs.google.com/spreadsheets/d/1DWWUHyOv52j-nAPIGqscrVhzreicduFSnOR7B9Q1pRs/edit#gid=649398435)

Use the `csv` menu to export all as csv. Download the resulting google drive folder and move its contents to `./scripts/csv-to-json/csv`.

Run `scripts % yarn build-csv`