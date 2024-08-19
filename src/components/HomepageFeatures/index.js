import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Expansive',
    Svg: require('@site/static/img/undraw_trip_re_f724.svg').default,
    description: (
      <>
        Evolved from Kokanu but with a larger lexicon. Most added words
        identified in review of <a href="https://intranet.secure.griffith.edu.au/schools-departments/natural-semantic-metalanguage/minimal-english">Minimal English</a> and <a href="https://minilanguage.com">Mini</a> materials.
        An emphasis on reducing of the semantic space within each word.
      </>
    ),
  },
  {
    title: 'Expressive',
    Svg: require('@site/static/img/undraw_book_reading_re_fu2c.svg').default,
    description: (
      <>
        Words are considered based upon the length and comprehensibility of
        existing phrases that represent them, the commonality of the concept
        itself, and the usefulness within other compound phrases.
      </>
    ),
  },
  {
    title: 'Succinct',
    Svg: require('@site/static/img/undraw_everyday_life_re_1lfb.svg').default,
    description: (
      <>
        Several new grammatical particles to increase the breadth of grammar
        that is available. Providing a greater amount of information density
        at the cost of a slight reduction in ease-of-learning.
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
