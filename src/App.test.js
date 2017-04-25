import React from 'react';
import App from './App';
import { shallow } from 'enzyme';


describe('App', () => {
  it('Renders App without crashing', () => {
    const wrapper = shallow(<App />);
    const indexLink = <a href="/">AMO Milestones</a>;
    expect(wrapper).toContainReact(indexLink);
  });

  it('has a source code link', () => {
    const wrapper = shallow(<App />);
    const srcLink = wrapper.find('[data-ref="src"]');
    expect(srcLink.prop('rel')).toBe('noopener noreferrer');
  });
});
