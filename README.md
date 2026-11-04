# relabel

This is website uses [Next.js](https://nextjs.org/) with [Mantine](https://mantine.dev/) for the front-end and set up to be instantly deployed to [Vercel](https://vercel.com/)


## Getting started

First of all you will need node installed. Get it [here](https://nodejs.org/en/) if needed.

Then, clone repo and install npm packages:

```bash
git clone https://github.com/essenlive/relabel
npm install
```
You will need to setup your environment variables for POSTGRE, in an .env file. 

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Editing the P5.js sketch

The P5.js sketch file is located in `components/Sketch.js` and the definition is inside the `Sketch({ partners, production, materials, gestion })` function.

The `{ partners, production, materials, gestion }` props are passed by the label component and correspond to the sliders or the entities data depending on where the component is used.

All native P5.js function have to be prefixed by `p5.` to avoid instances conflicts. For example : 
- To use [draw()](https://p5js.org/reference/#/p5/draw) you would use `p5.draw = function () {*** content ***}`.
- To use a primitive like [stroke(***color***)](https://p5js.org/reference/#/p5/stroke) you would use `p5.stroke(***color***)`. 
- Or for a constant like [PI](https://p5js.org/reference/#/p5/PI)  you would use `p5.PI`.

On the other hand you have all the tools of javascript.


## Deployment

The website will be automatically deployed [here](https://relabel.essenlive.xyz) on each pushed commit (Netlify) if the build is successful.


## Tools documentation

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Mantine documentation](https://mantine.dev/) - Quickly get the css classes you need.
