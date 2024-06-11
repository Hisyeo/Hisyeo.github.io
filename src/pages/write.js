import React from 'react';
import Layout from '@theme/Layout';
import TextEditor from '@site/src/components/TextEditor';

export default function Write() {
  const [value, setValue] = React.useState("cukto ü nimü vio Hisyëö.");
  return (
    <Layout title="Write" description="A text editor">
      <TextEditor value={value} setValue={(value) => setValue(value)} />
    </Layout>
  );
}