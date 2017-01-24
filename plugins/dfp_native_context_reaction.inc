<?php

/**
 * @file
 * Context reaction plugin for DFP Respond.
 */

/**
 * Provides DFP native context reaction.
 */
class DFPNativeContextReaction extends context_reaction {
  public $dfp_native_tags = array();

  /**
   * Form options.
   */
  public function options_form($context) {
    $form = array();
    $values = array();

    // Get existing values for this form.
    $settings = $this->fetch_from_context($context);
    if (!empty($settings['values'])) {
      $values = $settings['values'];
    }

    // Get a list of all the tags.
    $options = array();
    $tags = dfp_tag_load_all();
    if (empty($tags)) {
      $form['message'] = array(
        '#markup' => t('Before you can use this reaction you need to <a href="/admin/structure/dfp_ads/add">Add a new DFP ad</a>.'),
      );
      return $form;
    }

    foreach ($tags as $tag) {
      $options[$tag->machinename] = $tag->slot;
    }

    $form['values'] = array(
      '#type' => 'fieldset',
    );
    $form['values']['ad_tag'] = array(
      '#type' => 'select',
      '#title' => t('DFP Ad tag'),
      '#description' => t('Select a DFP Ad tag to configure.'),
      '#options' => $options,
      '#default_value' => isset($values['ad_tag']) ? $values['ad_tag'] : array(),
    );
    $form['values']['selector'] = array(
      '#title' => t('Selector'),
      '#description' => t('Enter the CSS selector where you wish to ad unit to render. Multiple selector can be added, And one selector per line e.g ".field-name-body fiel-item >p".  dfp will get injected on first match. You can use # for id and . for class.'),
      '#type' => 'textarea',
      '#cols' => 10,
      '#rows' => 4,
      '#default_value' => isset($values['selector']) ? $values['selector'] : '',
    );
    $form['values']['position'] = array(
      '#title' => t('Position'),
      '#description' => t('This determines the position within the selector where you wish to place the ad unit. If you want an ad to appear after the third child add 3 or leave i empty if you want it to be the first element.'),
      '#type' => 'textfield',
      '#size' => 10,
      '#default_value' => isset($values['position']) ? $values['position'] : '',
    );
    $form['values']['placement'] = array(
      '#title' => t('Placement'),
      '#description' => t('This determins how the ad slot should be placed. By default this will be inserted as indicated by the selector & position, pushing all other children down, but it is also possible to replace the element indicated by the selector & position.'),
      '#type' => 'select',
      '#options' => array(
        'insert' => t('Insert'),
        'replace' => t('Replace'),
      ),
      '#default_value' => isset($values['placement']) ? $values['placement'] : 'insert',
    );

    return $form;
  }

  /**
   * Execute context.
   */
  public function execute() {
    $i = 0;
    foreach ($this->get_contexts() as $context) {
      if (!isset($context->reactions['dfp_native'])) {
        continue;
      }

      foreach ($context->reactions['dfp_native'] as $values) {
        if (!empty($values)) {
          $this->dfp_native_tags['placement' . ++$i] = $values;
        }
      }
    }
  }

}