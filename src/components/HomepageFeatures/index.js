import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Evolution',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Evolved from Kokanu but with a larger lexicon. Most added words
        identified in review of Minimal English and MiniLang materials. Still 
        relies on compound phrases for complex topics but they are shorter now.
      </>
    ),
  },
  {
    title: 'Expressivity',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Words are considered based upon the length and understandability of
        existing compound phrases, the commonality of the concept itself, and the
        amount of usefulness within other compound phrases.
      </>
    ),
  },
  {
    title: 'Succinct',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Some new grammar has been integrated to increase the breadth of grammar
        that is available. Albeit, with a slight reduction in ease-of-learning
        but these changes make Hisyëö more regular and help specify what tense,
        aspect, or mood that the sentence is in.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
