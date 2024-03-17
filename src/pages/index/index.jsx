import React, {useState} from "react";
import {Button, Form, Grid, Input, Popup, TextArea, Radio, Checkbox} from '@nutui/nutui-react-taro';
import './index.scss'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components';
import {Close} from '@nutui/icons-react-taro'

const TYPES = ['输入框', '大输入框', '单选', '多选']

let index = 0

const App = () => {
    const [formItems, setFormItems] = useState([])
    const [addDrawerVisible, setAddDrawerVisible] = useState(false)
    const [itemSettingsDrawerVisible, setItemSettingsDrawerVisible] = useState(false)
    const [itemType, setItemType] = useState()
    const [itemOptions, setItemOptions] = useState([])

    const renderForm = () => {
        return formItems.map(({type, name, label, options}, index) => {
            const indexedLabel = `${index+1}.${label}`
            switch (type) {
                case 'input':
                    return <Form.Item
                        label={indexedLabel}
                        name={name}
                    >
                        <Input/>
                    </Form.Item>
                case 'textarea':
                    return <Form.Item
                        label={indexedLabel}
                        name={name}
                    >
                        <TextArea/>
                    </Form.Item>
                case 'radio':
                    return <Form.Item
                        label={indexedLabel}
                        name={name}
                    >
                        <Radio.Group>
                            {options.values.map((val, i) =><Radio key={i} value={i}>{val}</Radio>)}
                        </Radio.Group>
                    </Form.Item>
                case 'checkbox':
                    return <Form.Item
                        label={indexedLabel}
                        name={name}
                    >
                        <Checkbox.Group>

                            {options.values.map((val, i) =><Checkbox key={i} value={i}>{val}</Checkbox>)}
                        </Checkbox.Group>
                    </Form.Item>
                default:
                    return null
            }
        })
    }

    const handleClickedAddFormItem = (type) => {
        setItemType(type)
        setItemOptions([{name: 0}])
        setItemSettingsDrawerVisible(true)
    }

    const renderItemSettings = () => {
        switch (itemType) {
            case '输入框':
            case '大输入框':
                return <Form.Item
                    label="标题"
                    name="title"
                    rules={[{required: true}]}
                >
                    <Input type="text"/>
                </Form.Item>
            case '单选':
            case '多选':
                return <>
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{required: true}]}
                    >
                        <Input type="text"/>
                    </Form.Item>
                    {itemOptions.map(({name}, i) => <Form.Item
                        label={<div style={{display: 'flex', alignItems: 'center'}}>选项{i + 1}
                            {itemOptions.length > 1 && <Close onClick={() => {
                                itemOptions.splice(i, 1)
                                setItemOptions([...itemOptions])
                            }} style={{marginLeft: '12px'}}
                            />}</div>}
                        name={name}
                        key={name}
                        rules={[{required: true}]}
                    >
                        <Input type="text"/>
                    </Form.Item>)}
                    <Form.Item>
                        <Button block
                                onClick={() => setItemOptions([...itemOptions, {name: itemOptions[itemOptions.length - 1].name + 1}])}>
                            增加选项
                        </Button>
                    </Form.Item>
                </>
            default:
                return null
        }
    }

    const addFormItem = (values) => {
        let newItem
        switch (itemType) {
            case '输入框':
                newItem = {
                    type: 'input',
                    name: index++,
                    label: values.title,
                    options: {
                        type: 'text',
                    }
                }
                break
            case '大输入框':
                newItem = {
                    type: 'textarea',
                    name: index++,
                    label: values.title,
                    options: {}
                }
                break
            case '单选':
            case '多选':
                const keys = Object.keys(values).slice(1)
                newItem = {
                    type: type === '单选' ? 'radio': 'checkbox',
                    name: index++,
                    label: values.title,
                    options: {
                        values: keys.map(key => values[key])
                    }
                }
                break
            default:
        }
        if (newItem) {
            setFormItems(items => [...items, newItem])
        }
        setItemSettingsDrawerVisible(false)
    }

    return (
        <>
            <Form
                divider
                labelPosition="top"
                footer={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Button
                            onClick={() => {
                                setAddDrawerVisible(true)
                            }}>
                            增加表单项
                        </Button>
                        {/*<Button style={{ marginLeft: '20px' }}>*/}
                        {/*    预览*/}
                        {/*</Button>*/}
                    </div>
                }
            >
                <Form.Item
                    label="表单标题"
                    name="title"
                    rules={[{required: true}]}
                >
                    <Input placeholder="请输入表单名称" type="text"/>
                </Form.Item>
                <Form.Item
                    label="表单描述"
                    name="description"
                    rules={[{required: true}]}
                >
                    <TextArea placeholder="请输入表单描述"/>
                </Form.Item>
                <View>表单内容</View>
                {renderForm()}
            </Form>
            <Popup visible={addDrawerVisible} position="bottom" onClose={() => {
                setAddDrawerVisible(false)
            }}>
                <Grid columns={3} onClick={({index}) => {
                    setAddDrawerVisible(false)
                    handleClickedAddFormItem(TYPES[index])
                }}>
                    {TYPES.map(i => <Grid.Item text={i} key={i}/>)}
                </Grid>
            </Popup>
            {itemSettingsDrawerVisible && <Popup
                closeOnOverlayClick={false}
                visible={itemSettingsDrawerVisible}
                position="bottom"
                onClose={() => {
                    setItemSettingsDrawerVisible(false)
                }}
            >
                <Form
                    divider
                    labelPosition="left"
                    onFinish={(values) => addFormItem(values)}
                    onFinishFailed={(values, errors) => Taro.showToast({title: '请核对内容！', icon: 'error'})}
                    footer={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <Button onClick={() => setItemSettingsDrawerVisible(false)}>
                                取消
                            </Button>
                            <Button formType="submit" style={{marginLeft: '20px'}}>
                                添加
                            </Button>
                        </div>
                    }
                >>
                    {renderItemSettings()}
                </Form>
            </Popup>}
        </>
    )
}

export default App;
