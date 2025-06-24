import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Language',
    Svg: require('@site/static/img/undraw_everyday_life_re_1lfb.svg').default,
    description: (
      <>
        There are only 866 words and they don't mutate, similar
        to <a href="https://tokipona.org">
          Toki Pona
        </a> and <a href="https://kokanu.com">
          Kokanu
        </a> but with a more natural grammar and lexicon.
      </>
    ),
  },
  {
    title: 'Community',
    Svg: require('@site/static/img/undraw_trip_re_f724.svg').default,
    description: (
      <>
        Join a group of Hîsyêô-speaking people creating an organization
        of <a href="https://participatoryeconomy.org">
            worker councils
        </a> and <a href="https://www.thefec.org">
            intentional communites
        </a>.
      </>
    ),
  },
  {
    title: 'Culture',
    Svg: require('@site/static/img/undraw_book_reading_re_fu2c.svg').default,
    description: (
      <>
        A fully-fledged set of beliefs, idioms, & festivals. Values of
        liberty, justice, and participation for all sapient life.
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
