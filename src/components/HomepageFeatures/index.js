import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Succinct',
    Svg: require('@site/static/img/undraw_everyday_life_re_1lfb.svg').default,
    description: (
      <>
        There are under 900 words to learn. Not as small as Kokanu or Toki Pona
        but much smaller than Globasa, Lidepla and Esperanto. A tiny fraction of
        the lexicon sizes of natural languages.
      </>
    ),
  },
  {
    title: 'Expansive',
    Svg: require('@site/static/img/undraw_trip_re_f724.svg').default,
    description: (
      <>
        Words are considered based upon the length and comprehensibility of
        existing phrases that represent them, the commonality of the concept
        itself, and the usefulness within other compound phrases.
      </>
    ),
  },
  {
    title: 'Expressive',
    Svg: require('@site/static/img/undraw_book_reading_re_fu2c.svg').default,
    description: (
      <>
        The grammar has the capability of formulating complex meanings with the
        limited vocabulary whilst maintaining shorter sentences and limited
        nested clauses.
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
