import React, { cloneElement, Children } from 'react'

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

import HisyeoText from '../HisyeoText'

/**
 * @typedef {object} Word
 * @property {string} abugida
 * @property {string} meaning
 * @property {string} verb
 * @property {string} noun
 * @property {string} modifier
 * @property {string} frequentative
 * @property {string} type
 * @property {string} kokanu
 * @property {string} origin
 * @property {string} ipa
 * @property {string} family
 * @property {string} group
 * @property {string} length
 * @property {string} rank
 */


/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoTabs(props) {
  return (
    <Tabs groupId="boböun-kon-cukto" queryString>
        <TabItem value="latin" label="Latin" default>
        { Children.map(props.children, (child, index) => (
          <HisyeoText key={`latin-${index}`} kind='latin'>
            {child.props.children}
          </HisyeoText>
        )) }
        </TabItem>
        <TabItem value="opügido" label="ɽʋʄꜿɟʌ">
        { Children.map(props.children, (child, index) => (
          <HisyeoText key={`abugida-${index}`} kind='abugida'>
            {child.props.children}
          </HisyeoText>
        )) }
        </TabItem>
    </Tabs>
  )
}
