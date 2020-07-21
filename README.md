# A repo containing useful code snippets for computational biologists

@crankysparrow, with contributions from @bbitarello

## Clone this repo

Either into a directory in your computer by running

```
git clone https://github.com/crankysparrow/computationalbio.git
```

or by clicking 'open in github desktop'(above, on the right)

## An API query tool for [gnomAD](https://gnomad.broadinstitute.org/)
Requirements:

-[Node.js](https://nodejs.org/en/download/) 

-[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

You can follow [this guide](https://blog.teamtreehouse.com/install-node-js-npm-mac) and simply run:

```
npm install

```

Now that the setup is complete, you can use the tool. 

First, you need to provide an input file, containing SNP IDs, one per line, like [this one](rsIDs.txt). Put it in the same directory where you cloned the repo and use this exact name ('rsIDS.txt') for that file.

Next, convert that into a json format file [like this one](rsIDs.json) by running:

```
node readIDs.js
```

Now you can run the query and save the output into a file like this one:

```
node index.js
```

The output will contain 'GNOMAD-GENOMES' and 'GNOMAD-EXOMES' (in the absence of the former) allelic frequencies for each SNP in the NFE (non-Finnish European) population. If you want a different population or different anything, you can [edit the index.js](index.js) file.

```
#A fragment of the output:

[
  {
    "study": "GNOMAD_GENOMES",
    "population": "NFE",
    "refAllele": "T",
    "altAllele": "C",
    "refAlleleFreq": 0.6836476,
    "altAlleleFreq": 0.31635246,
    "refHomGenotypeFreq": 0.4681107,
    "hetGenotypeFreq": 0.43107367,
    "altHomGenotypeFreq": 0.10081562,
    "id": "rs2465136"
  },
  {


```
##